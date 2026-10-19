// Primeiro ensaio: somente USB e Serial, sem Wi-Fi, API ou LEDs.
#include <Arduino.h>

const uint8_t TRIG[3] = {25, 26, 27};
const uint8_t ECHO[3] = {32, 33, 34};

float medirCm(int sensor) {
  digitalWrite(TRIG[sensor], LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG[sensor], HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG[sensor], LOW);
  unsigned long duracao = pulseIn(ECHO[sensor], HIGH, 30000);
  float cm = duracao * 0.0343f / 2.0f;
  return duracao && cm >= 2 && cm <= 400 ? cm : -1;
}

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 3; i++) {
    pinMode(TRIG[i], OUTPUT);
    digitalWrite(TRIG[i], LOW);
    pinMode(ECHO[i], INPUT);
  }
  delay(1000);
  Serial.println("Teste USB: S01=25/32, S02=26/33, S03=27/34 (TRIG/ECHO).");
}

void loop() {
  for (int i = 0; i < 3; i++) {
    float cm = medirCm(i);
    if (cm < 0) Serial.printf("S%02d: SEM LEITURA VALIDA\n", i + 1);
    else Serial.printf("S%02d: %.1f cm\n", i + 1, cm);
    delay(80); // Separa disparos para reduzir interferência entre sensores.
  }
  Serial.println("---");
  delay(1000);
}
