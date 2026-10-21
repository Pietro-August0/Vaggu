#include <WiFi.h>
#include <WiFiUdp.h>
#include <NetworkClientSecure.h>
#include <HTTPClient.h>
#include <time.h>
#include "../vaggu_3_vagas/config.h"
#include "../vaggu_3_vagas/relogio_serial.h"

// Diagnóstico sem Authorization e sem envio das leituras ou credenciais.
void testarTcp(const char* nome, IPAddress ip, uint16_t porta) {
  WiFiClient cliente;
  unsigned long inicio = millis();
  bool ok = cliente.connect(ip, porta, 4000);
  Serial.printf("TCP %s:%u = %s (%lu ms)\n", nome, porta, ok ? "OK" : "FALHOU", millis() - inicio);
  cliente.stop();
}

void testarNtp() {
  WiFiUDP udp;
  if (!udp.begin(2390)) { Serial.println("UDP local: FALHOU"); return; }
  uint8_t pedido[48] = {};
  pedido[0] = 0x23; // NTP v4, cliente.
  bool enviado = udp.beginPacket(IPAddress(216,239,35,0), 123)
    && udp.write(pedido, sizeof(pedido)) == sizeof(pedido) && udp.endPacket();
  unsigned long inicio = millis();
  int tamanho = 0;
  while (enviado && millis() - inicio < 5000 && !(tamanho = udp.parsePacket())) delay(20);
  Serial.printf("NTP IPv4 direto: envio %s, resposta %d bytes\n", enviado ? "OK" : "FALHOU", tamanho);
  udp.stop();
}

void diagnosticar() {
  Serial.println("--- DIAGNOSTICO SEM CREDENCIAIS ---");
  Serial.print("IP: "); Serial.println(WiFi.localIP());
  Serial.print("Gateway: "); Serial.println(WiFi.gatewayIP());
  Serial.print("DNS: "); Serial.println(WiFi.dnsIP());
  Serial.printf("Sinal: %d dBm\n", WiFi.RSSI());
  IPAddress servidor;
  bool dnsOk = WiFi.hostByName("vaggu-tcc.onrender.com", servidor) == 1;
  Serial.printf("DNS Vaggu: %s\n", dnsOk ? "OK" : "FALHOU");
  if (dnsOk) { Serial.print("IPv4 Vaggu: "); Serial.println(servidor); testarTcp("Vaggu", servidor, 443); }
  testarTcp("IP publico sem DNS", IPAddress(1,1,1,1), 443);
  testarTcp("API local no computador", WiFi.gatewayIP(), 3000);
  IPAddress ntp;
  Serial.printf("DNS NTP: %s\n", WiFi.hostByName("time.google.com", ntp) == 1 ? "OK" : "FALHOU");
  testarNtp();
  Serial.printf("Relogio sincronizado: %s\n", time(nullptr) >= 1767225600 ? "SIM" : "NAO");
  if (time(nullptr) >= 1767225600 && dnsOk) {
    NetworkClientSecure seguro;
    seguro.useBuiltinCACertBundle();
    seguro.setHandshakeTimeout(10);
    HTTPClient http;
    http.setConnectTimeout(5000); http.setTimeout(10000);
    http.setFollowRedirects(HTTPC_DISABLE_FOLLOW_REDIRECTS);
    if (http.begin(seguro, "https://vaggu-tcc.onrender.com/api/v1/health/ready")) {
      Serial.printf("HTTPS publico, certificado validado: HTTP %d\n", http.GET());
      http.end();
    }
  }
  Serial.println("--- FIM; repete em 30 segundos ---");
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_SENHA);
  configTime(0, 0, "pool.ntp.org", "time.google.com");
}

void loop() {
  receberHorarioUsb();
  if (WiFi.status() != WL_CONNECTED) { Serial.println("Aguardando Wi-Fi..."); delay(3000); return; }
  diagnosticar();
  unsigned long espera = millis();
  while (millis() - espera < 30000) { receberHorarioUsb(); delay(20); }
}
