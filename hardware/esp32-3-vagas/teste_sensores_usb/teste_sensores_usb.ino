// Ensaio USB/Serial dos três sensores e seis LEDs, sem Wi-Fi ou API.
#include <Arduino.h>

const uint8_t TRIG[3] = {27, 26, 25};
const uint8_t ECHO[3] = {32, 33, 34};
const uint8_t VERMELHO[3] = {13, 14, 23};
const uint8_t VERDE[3] = {18, 19, 21};
int estado[3] = {-1, -1, -1};

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
    pinMode(VERMELHO[i], OUTPUT);
    pinMode(VERDE[i], OUTPUT);
    digitalWrite(VERMELHO[i], LOW);
    digitalWrite(VERDE[i], LOW);
  }
  Serial.println("TESTE USB: tres sensores e seis LEDs.");
  for (int i = 0; i < 3; i++) {
    Serial.printf("P%02d: vermelho GPIO%u, depois verde GPIO%u\n", i + 1, VERMELHO[i], VERDE[i]);
    digitalWrite(VERMELHO[i], HIGH); delay(600);
    digitalWrite(VERMELHO[i], LOW);
    digitalWrite(VERDE[i], HIGH); delay(600);
    digitalWrite(VERDE[i], LOW);
  }
}

void loop() {
  for (int i = 0; i < 3; i++) {
    float cm = medirCm(i);
    if (cm < 0) estado[i] = -1;
    else if (cm <= 15) estado[i] = 1;
    else if (cm >= 18) estado[i] = 0;
    digitalWrite(VERMELHO[i], estado[i] == 1 ? HIGH : LOW);
    digitalWrite(VERDE[i], estado[i] == 0 ? HIGH : LOW);
    if (cm < 0) Serial.printf("S%02d: SEM LEITURA VALIDA\n", i + 1);
    else Serial.printf("S%02d: %.1f cm\n", i + 1, cm);
    delay(80); // Separa disparos para reduzir interferência entre sensores.
  }
  Serial.println("---");
  delay(1000);
}
