#include <WiFi.h>
#include <HTTPClient.h>
#include <esp_system.h>
#include "config.h"
#include "transporte.h"
#include "relogio_serial.h"

// ESP32 clássico WROOM-32. Não usar esta pinagem em C3/S3 sem revisão.
const uint8_t TRIG[3] = {27, 26, 25};
const uint8_t ECHO[3] = {32, 33, 34};
const uint8_t LED_OCUPADA[3] = {13, 14, 23};
const uint8_t LED_LIVRE[3] = {18, 19, 21};
const unsigned long SILENCIO_ACUSTICO_MS = 120;
const char* SUFIXOS[3] = {"-S01", "-S02", "-S03"};
const float OCUPAR_CM[3] = {15, 15, 15};
const float LIBERAR_CM[3] = {18, 18, 18};
int estados[3] = {-1, -1, -1};
String inicializacaoId;
uint32_t sequencia = 0;
bool iniciou = false;
bool bloqueado = false;
unsigned long ultimaTentativaWifi = 0;

void indicarVaga(uint8_t i, int estado) {
  digitalWrite(LED_OCUPADA[i], LOW);
  digitalWrite(LED_LIVRE[i], LOW);
  if (estado == 1) digitalWrite(LED_OCUPADA[i], HIGH);
  if (estado == 0) digitalWrite(LED_LIVRE[i], HIGH);
}

float medir(uint8_t i) {
  digitalWrite(TRIG[i], LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG[i], HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG[i], LOW);
  unsigned long pulso = pulseIn(ECHO[i], HIGH, 30000);
  float cm = pulso * 0.0343f / 2.0f;
  return pulso && cm >= 2 && cm <= 400 ? cm : -1;
}

// Tolera uma amostra perdida somente quando as outras duas concordam.
float medirFiltrado(uint8_t i) {
  float validas[3];
  int quantidade = 0;
  for (int amostra = 0; amostra < 3; amostra++) {
    float cm = medir(i);
    if (cm >= 0) validas[quantidade++] = cm;
    // Nenhum TRIG durante esta pausa, inclusive ao trocar de sensor ou após timeout.
    delay(SILENCIO_ACUSTICO_MS);
  }
  if (quantidade < 2) return -1;
  for (int a = 0; a < quantidade; a++) for (int b = a + 1; b < quantidade; b++) {
    if (validas[a] > validas[b]) { float t = validas[a]; validas[a] = validas[b]; validas[b] = t; }
  }
  // Exige um par coerente até quando as três amostras retornam algum eco.
  int melhorPar = -1;
  float menorDiferenca = 401;
  for (int a = 0; a + 1 < quantidade; a++) {
    float baixa = validas[a], alta = validas[a + 1];
    float diferenca = alta - baixa;
    if (diferenca > max(2.0f, (baixa + alta) * 0.075f)) continue;
    if (baixa <= OCUPAR_CM[i] && alta >= LIBERAR_CM[i]) continue;
    if (diferenca < menorDiferenca) { melhorPar = a; menorDiferenca = diferenca; }
  }
  return melhorPar < 0 ? -1 : (validas[melhorPar] + validas[melhorPar + 1]) / 2.0f;
}

String base() {
  return String("{\"placaCodigo\":\"") + PLACA_CODIGO +
    "\",\"inicializacaoId\":\"" + inicializacaoId +
    "\",\"sequencia\":" + String(sequencia);
}

bool enviar(const char* rota, const String& corpo) {
  // Mantém o socket entre ciclos; evita repetir handshake TLS a cada leitura.
  static WiFiClient cliente;
  static NetworkClientSecure seguro;
  static HTTPClient http;
  http.setReuse(true);
  if (!abrirTransporte(http, cliente, seguro, String(API_BASE) + rota)) return false;
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Device ") + PLACA_CHAVE);
  unsigned long inicioEnvio = millis();
  int status = http.POST(corpo);
  Serial.printf("HTTP %d | sequencia %lu | envio %lu ms\n", status, (unsigned long)sequencia, millis() - inicioEnvio);
  // Não imprime chave ou dados de Wi-Fi.
  if (status > 0) Serial.println(http.getString());
  if (status < 0 && String(API_BASE).startsWith("https://")) {
    char detalhe[160];
    seguro.lastError(detalhe, sizeof(detalhe));
    Serial.printf("Diagnostico TLS: %s\n", detalhe);
  }
  http.end();
  // Conexão encerrada ou erro: o próximo ciclo abre outra com validação completa.
  if (status < 0) { seguro.stop(); cliente.stop(); }
  if (status >= 400 && status < 500 && status != 408 && status != 429) {
    bloqueado = true;
    Serial.println("Requisicao recusada: confira URL, chave e sensores; depois reinicie.");
  }
  return status == 200 || status == 202;
}

void setup() {
  Serial.begin(115200);
  Serial.println("VAGGU: seis LEDs, disparos separados por 120 ms de silencio, S01=27/32, S02=26/33, S03=25/34.");
  for (int i = 0; i < 3; i++) {
    pinMode(TRIG[i], OUTPUT); digitalWrite(TRIG[i], LOW);
    pinMode(ECHO[i], INPUT);
    pinMode(LED_OCUPADA[i], OUTPUT);
    pinMode(LED_LIVRE[i], OUTPUT);
    indicarVaga(i, -1);
  }
  for (uint8_t i = 0; i < 3; ++i) {
    indicarVaga(i, 1); delay(350);
    indicarVaga(i, 0); delay(350);
    indicarVaga(i, -1);
  }
  char identificador[48];
  snprintf(identificador, sizeof(identificador), "esp32-%08lx-%08lx-%08lx",
    (unsigned long)esp_random(), (unsigned long)esp_random(), (unsigned long)esp_random());
  inicializacaoId = identificador;
  WiFi.mode(WIFI_STA);
  WiFi.setSleep(false); // Bancada alimentada por USB: prioriza latência.
  WiFi.onEvent([](WiFiEvent_t, WiFiEventInfo_t info) {
    Serial.printf("Wi-Fi desconectou; motivo tecnico: %u\n", info.wifi_sta_disconnected.reason);
  }, ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  int redes = WiFi.scanNetworks();
  bool encontrou = false;
  for (int i = 0; i < redes; i++) {
    if (WiFi.SSID(i) == WIFI_SSID) {
      encontrou = true;
      Serial.printf("Hotspot configurado encontrado: canal %d, sinal %d dBm, seguranca %d\n", WiFi.channel(i), WiFi.RSSI(i), (int)WiFi.encryptionType(i));
    }
  }
  if (!encontrou) Serial.println("Hotspot configurado nao encontrado na faixa de 2,4 GHz.");
  WiFi.scanDelete();
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_SENHA);
  ultimaTentativaWifi = millis();
}

void loop() {
  receberHorarioUsb();
  // A indicação física depende apenas do eco e continua mesmo sem rede.
  String leituras;
  for (int i = 0; i < 3; i++) {
    float cm = medirFiltrado(i);
    if (cm < 0) estados[i] = -1;
    else if (cm <= OCUPAR_CM[i]) estados[i] = 1;
    else if (cm >= LIBERAR_CM[i]) estados[i] = 0;
    indicarVaga(i, estados[i]);
    Serial.printf("S%02d: %.1f cm | %s\n", i + 1, cm,
      estados[i] == 1 ? "VERMELHO" : estados[i] == 0 ? "VERDE" : "SEM ESTADO");
    if (estados[i] < 0) continue;
    if (leituras.length()) leituras += ',';
    leituras += String("{\"sensorCodigo\":\"") + PLACA_CODIGO + SUFIXOS[i] +
      "\",\"estadoDetectado\":\"" + (estados[i] ? "OCUPADA" : "LIVRE") + "\"}";
  }
  if (bloqueado) { delay(100); return; }
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Aguardando Wi-Fi 2,4 GHz...");
    if (millis() - ultimaTentativaWifi >= 15000UL) {
      WiFi.disconnect();
      WiFi.begin(WIFI_SSID, WIFI_SENHA);
      ultimaTentativaWifi = millis();
    }
    delay(3000); return;
  }
  if (!iniciou) {
    Serial.print("Wi-Fi conectado. IP da ESP32: "); Serial.println(WiFi.localIP());
    // Mantém exatamente o heartbeat de sequência zero até receber confirmação.
    iniciou = enviar("/heartbeat", base() + "}");
    if (iniciou) sequencia++;
    delay(1000); return;
  }
  if (leituras.length()) enviar("/estados", base() + ",\"leituras\":[" + leituras + "]}");
  else enviar("/heartbeat", base() + "}");
  // Próximo ciclo usa leituras novas, mesmo após timeout (não reenviar estado antigo).
  sequencia++;
  if (sequencia >= 2147483647UL) ESP.restart();
  delay(100);
}
