#include <WiFi.h>
#include <HTTPClient.h>
#include <esp_system.h>
#include "config.h"

// ESP32 clássico WROOM-32. Não usar esta pinagem em C3/S3 sem revisão.
const uint8_t TRIG[3] = {25, 26, 27};
const uint8_t ECHO[3] = {32, 33, 34};
const uint8_t LED_OCUPADA[3] = {13, 14, 23};
const bool USAR_LEDS = false; // Montagem atual sem LEDs.
const char* SUFIXOS[3] = {"-S01", "-S02", "-S03"};
const float OCUPAR_CM[3] = {15, 15, 15};
const float LIBERAR_CM[3] = {18, 18, 18};
int estados[3] = {-1, -1, -1};
String inicializacaoId;
uint32_t sequencia = 0;
bool iniciou = false;
bool bloqueado = false;

void apagarLeds() {
  if (!USAR_LEDS) return;
  for (int i = 0; i < 3; i++) digitalWrite(LED_OCUPADA[i], LOW);
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

// Mediana de três amostras; qualquer amostra inválida omite o sensor neste ciclo.
float medirFiltrado(uint8_t i) {
  float a = medir(i); delay(65);
  float b = medir(i); delay(65);
  float c = medir(i); delay(65);
  if (a < 0 || b < 0 || c < 0) return -1;
  if (a > b) { float t = a; a = b; b = t; }
  if (b > c) { float t = b; b = c; c = t; }
  if (a > b) { float t = a; a = b; b = t; }
  return b;
}

String base() {
  return String("{\"placaCodigo\":\"") + PLACA_CODIGO +
    "\",\"inicializacaoId\":\"" + inicializacaoId +
    "\",\"sequencia\":" + String(sequencia);
}

bool enviar(const char* rota, const String& corpo) {
  WiFiClient cliente;
  HTTPClient http;
  http.setConnectTimeout(2000);
  http.setTimeout(3000);
  if (!http.begin(cliente, String(API_BASE) + rota)) return false;
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Device ") + PLACA_CHAVE);
  int status = http.POST(corpo);
  Serial.printf("HTTP %d | sequencia %lu\n", status, (unsigned long)sequencia);
  // Não imprime chave ou dados de Wi-Fi.
  if (status > 0) Serial.println(http.getString());
  http.end();
  if (status >= 400 && status < 500 && status != 408 && status != 429) {
    bloqueado = true;
    Serial.println("Requisicao recusada: confira URL, chave e sensores; depois reinicie.");
  }
  return status == 200 || status == 202;
}

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 3; i++) {
    pinMode(TRIG[i], OUTPUT); digitalWrite(TRIG[i], LOW);
    pinMode(ECHO[i], INPUT);
    if (USAR_LEDS) { pinMode(LED_OCUPADA[i], OUTPUT); digitalWrite(LED_OCUPADA[i], LOW); }
  }
  char identificador[48];
  snprintf(identificador, sizeof(identificador), "esp32-%08lx-%08lx-%08lx",
    (unsigned long)esp_random(), (unsigned long)esp_random(), (unsigned long)esp_random());
  inicializacaoId = identificador;
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_SENHA);
}

void loop() {
  if (bloqueado) { apagarLeds(); delay(1000); return; }
  if (WiFi.status() != WL_CONNECTED) {
    apagarLeds();
    Serial.println("Aguardando Wi-Fi 2,4 GHz...");
    WiFi.reconnect(); delay(3000); return;
  }
  if (!iniciou) {
    // Mantém exatamente o heartbeat de sequência zero até receber confirmação.
    iniciou = enviar("/heartbeat", base() + "}");
    if (iniciou) sequencia++;
    delay(3000); return;
  }
  String leituras;
  for (int i = 0; i < 3; i++) {
    float cm = medirFiltrado(i);
    Serial.printf("S%02d: %.1f cm\n", i + 1, cm);
    if (cm < 0) { estados[i] = -1; if (USAR_LEDS) digitalWrite(LED_OCUPADA[i], LOW); continue; }
    if (cm <= OCUPAR_CM[i]) estados[i] = 1;
    else if (cm >= LIBERAR_CM[i]) estados[i] = 0;
    // Detecção local; a confirmação de 30 s continua sendo feita na API.
    if (USAR_LEDS) digitalWrite(LED_OCUPADA[i], estados[i] == 1 ? HIGH : LOW);
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
  delay(3000);
}
