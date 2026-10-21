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
const bool USAR_LEDS = true; // Somente LED da vaga 1 montado no GPIO13.
const uint8_t QUANTIDADE_LEDS = 1;
const char* SUFIXOS[3] = {"-S01", "-S02", "-S03"};
const float OCUPAR_CM[3] = {15, 15, 15};
const float LIBERAR_CM[3] = {18, 18, 18};
int estados[3] = {-1, -1, -1};
String inicializacaoId;
uint32_t sequencia = 0;
bool iniciou = false;
bool bloqueado = false;
unsigned long ultimaTentativaWifi = 0;

void apagarLeds() {
  if (!USAR_LEDS) return;
  for (int i = 0; i < QUANTIDADE_LEDS; i++) digitalWrite(LED_OCUPADA[i], LOW);
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
    delay(65); // Preserva separação acústica entre disparos.
  }
  if (quantidade < 2) return -1;
  for (int a = 0; a < quantidade; a++) for (int b = a + 1; b < quantidade; b++) {
    if (validas[a] > validas[b]) { float t = validas[a]; validas[a] = validas[b]; validas[b] = t; }
  }
  if (quantidade == 3) return validas[1];
  float media = (validas[0] + validas[1]) / 2.0f;
  float tolerancia = max(2.0f, media * 0.15f);
  // Leituras em lados opostos dos limiares não devem fabricar uma classificação.
  if (validas[1] - validas[0] > tolerancia || (validas[0] <= OCUPAR_CM[i] && validas[1] >= LIBERAR_CM[i])) return -1;
  return media;
}

String base() {
  return String("{\"placaCodigo\":\"") + PLACA_CODIGO +
    "\",\"inicializacaoId\":\"" + inicializacaoId +
    "\",\"sequencia\":" + String(sequencia);
}

bool enviar(const char* rota, const String& corpo) {
  WiFiClient cliente;
  NetworkClientSecure seguro;
  HTTPClient http;
  if (!abrirTransporte(http, cliente, seguro, String(API_BASE) + rota)) return false;
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Device ") + PLACA_CHAVE);
  int status = http.POST(corpo);
  Serial.printf("HTTP %d | sequencia %lu\n", status, (unsigned long)sequencia);
  // Não imprime chave ou dados de Wi-Fi.
  if (status > 0) Serial.println(http.getString());
  if (status < 0 && String(API_BASE).startsWith("https://")) {
    char detalhe[160];
    seguro.lastError(detalhe, sizeof(detalhe));
    Serial.printf("Diagnostico TLS: %s\n", detalhe);
  }
  http.end();
  if (status >= 400 && status < 500 && status != 408 && status != 429) {
    bloqueado = true;
    Serial.println("Requisicao recusada: confira URL, chave e sensores; depois reinicie.");
  }
  return status == 200 || status == 202;
}

void setup() {
  Serial.begin(115200);
  Serial.println("VAGGU: telemetria com HTTPS validado, S01=27/32, S02=26/33, S03=25/34.");
  for (int i = 0; i < 3; i++) {
    pinMode(TRIG[i], OUTPUT); digitalWrite(TRIG[i], LOW);
    pinMode(ECHO[i], INPUT);
    if (USAR_LEDS && i < QUANTIDADE_LEDS) { pinMode(LED_OCUPADA[i], OUTPUT); digitalWrite(LED_OCUPADA[i], LOW); }
  }
  char identificador[48];
  snprintf(identificador, sizeof(identificador), "esp32-%08lx-%08lx-%08lx",
    (unsigned long)esp_random(), (unsigned long)esp_random(), (unsigned long)esp_random());
  inicializacaoId = identificador;
  WiFi.mode(WIFI_STA);
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
  if (bloqueado) { apagarLeds(); delay(1000); return; }
  if (WiFi.status() != WL_CONNECTED) {
    apagarLeds();
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
  String leituras;
  for (int i = 0; i < 3; i++) {
    float cm = medirFiltrado(i);
    Serial.printf("S%02d: %.1f cm\n", i + 1, cm);
    if (cm < 0) { estados[i] = -1; if (USAR_LEDS && i < QUANTIDADE_LEDS) digitalWrite(LED_OCUPADA[i], LOW); continue; }
    if (cm <= OCUPAR_CM[i]) estados[i] = 1;
    else if (cm >= LIBERAR_CM[i]) estados[i] = 0;
    // Detecção local; a janela de confirmação é configurada na API.
    if (USAR_LEDS && i < QUANTIDADE_LEDS) digitalWrite(LED_OCUPADA[i], estados[i] == 1 ? HIGH : LOW);
    // Após falha/inicialização, a faixa intermediária não confirma estado.
    if (estados[i] < 0) continue;
    if (leituras.length()) leituras += ',';
    leituras += String("{\"sensorCodigo\":\"") + PLACA_CODIGO + SUFIXOS[i] +
      "\",\"estadoDetectado\":\"" + (estados[i] ? "OCUPADA" : "LIVRE") + "\"}";
  }
  if (leituras.length()) enviar("/estados", base() + ",\"leituras\":[" + leituras + "]}");
  else enviar("/heartbeat", base() + "}");
  // Próximo ciclo usa leituras novas, mesmo após timeout (não reenviar estado antigo).
  sequencia++;
  if (sequencia >= 2147483647UL) ESP.restart();
  delay(100);
}
