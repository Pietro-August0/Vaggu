#pragma once
// Copie para config.h (ignorado pelo Git) e preencha localmente.
const char* WIFI_SSID = "SEU_WIFI_2G4";
const char* WIFI_SENHA = "SUA_SENHA";
// Sem barra final. O relógio NTP e o certificado são validados antes do POST.
const char* API_BASE = "https://vaggu-tcc.onrender.com/api/v1/telemetria";
// Apenas para bancada local: mudar para 1 e usar um IP privado HTTP.
#define VAGGU_PERMITIR_HTTP_LOCAL 0
const char* PLACA_CODIGO = "VAGGU_ESP32_01";
const char* PLACA_CHAVE = "CHAVE_GERADA_NO_PROVISIONAMENTO";
