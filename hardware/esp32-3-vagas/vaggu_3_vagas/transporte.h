#pragma once
#include <WiFi.h>
#include <NetworkClientSecure.h>
#include <HTTPClient.h>
#include <time.h>

// HTTP só pode ser habilitado explicitamente e para IPv4 privado de bancada.
#ifndef VAGGU_PERMITIR_HTTP_LOCAL
#define VAGGU_PERMITIR_HTTP_LOCAL 0
#endif

inline bool httpLocalPermitido(const String& url) {
  if (!VAGGU_PERMITIR_HTTP_LOCAL || !url.startsWith("http://")) return false;
  int fim = url.indexOf('/', 7);
  String host = url.substring(7, fim < 0 ? url.length() : fim);
  int porta = host.indexOf(':');
  if (porta >= 0) host = host.substring(0, porta);
  IPAddress ip;
  if (!ip.fromString(host)) return false;
  return ip[0] == 10 || (ip[0] == 192 && ip[1] == 168)
    || (ip[0] == 172 && ip[1] >= 16 && ip[1] <= 31);
}

inline bool prepararHttps() {
  static bool iniciouRelogio = false;
  if (!iniciouRelogio) {
    configTime(0, 0, "pool.ntp.org", "time.google.com");
    iniciouRelogio = true;
  }
  // Sem relógio válido não se contorna a validação temporal do certificado.
  if (time(nullptr) < 1767225600) {
    Serial.println("HTTPS: aguardando sincronizacao NTP; nenhum segredo enviado.");
    return false;
  }
  return true;
}

inline bool abrirTransporte(HTTPClient& http, WiFiClient& local, NetworkClientSecure& seguro, const String& url) {
  http.setFollowRedirects(HTTPC_DISABLE_FOLLOW_REDIRECTS);
  if (url.startsWith("https://")) {
    if (!prepararHttps()) return false;
    // Bundle oficial do core ESP32 3.3.12; verifica cadeia, validade e hostname.
    seguro.useBuiltinCACertBundle();
    seguro.setHandshakeTimeout(12);
    http.setConnectTimeout(12000);
    http.setTimeout(15000);
    return http.begin(seguro, url);
  }
  if (!httpLocalPermitido(url)) {
    Serial.println("Destino recusado: use HTTPS ou autorize HTTP privado de bancada.");
    return false;
  }
  http.setConnectTimeout(2000);
  http.setTimeout(3000);
  return http.begin(local, url);
}
