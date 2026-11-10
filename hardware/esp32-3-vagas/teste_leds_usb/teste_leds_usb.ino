#include <Arduino.h>

const uint8_t PINOS[] = {13, 18, 14, 19, 23, 21};
const char* const NOMES[] = {
  "P01 vermelho", "P01 verde", "P02 vermelho",
  "P02 verde", "P03 vermelho", "P03 verde"
};

void setup() {
  Serial.begin(115200);
  for (uint8_t pino : PINOS) {
    pinMode(pino, OUTPUT);
    digitalWrite(pino, LOW);
  }
}

void loop() {
  for (size_t i = 0; i < sizeof(PINOS) / sizeof(PINOS[0]); ++i) {
    Serial.printf("%s: GPIO %u\n", NOMES[i], static_cast<unsigned>(PINOS[i]));
    digitalWrite(PINOS[i], HIGH);
    delay(1200);
    digitalWrite(PINOS[i], LOW);
    delay(300);
  }
}
