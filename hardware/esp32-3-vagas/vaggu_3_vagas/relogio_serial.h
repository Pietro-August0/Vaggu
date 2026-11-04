#pragma once
#include <Arduino.h>
#include <sys/time.h>
#include <stdlib.h>

// Ajuste de bancada pelo computador conectado fisicamente ao USB.
// Não aceita horário de HTTP, não desativa a validação TLS e não persiste após reset.
inline void receberHorarioUsb() {
  static char linha[32];
  static size_t tamanho = 0;
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\r') continue;
    if (c == '\n') {
      linha[tamanho] = '\0';
      if (strncmp(linha, "TIME ", 5) == 0) {
        char* fim;
        unsigned long long segundos = strtoull(linha + 5, &fim, 10);
        if (fim != linha + 5 && *fim == '\0' && segundos >= 1767225600ULL && segundos < 4102444800ULL) {
          struct timeval horario = { static_cast<time_t>(segundos), 0 };
          Serial.println(settimeofday(&horario, nullptr) == 0 ? "Relogio ajustado pelo USB; validacao TLS permanece ativa." : "Falha ao ajustar relogio USB.");
        } else Serial.println("Horario USB recusado.");
      }
      tamanho = 0;
    } else if (tamanho < sizeof(linha) - 1) linha[tamanho++] = c;
    else tamanho = 0;
  }
}
