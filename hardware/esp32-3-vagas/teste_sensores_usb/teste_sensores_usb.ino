// Ensaio USB/Serial com LED da vaga 1, sem Wi-Fi ou API.
#include <Arduino.h>

const uint8_t TRIG[3] = {27, 26, 25};
const uint8_t ECHO[3] = {32, 33, 34};
const uint8_t LED_VAGA_1 = 13;
const float LIMIAR_LED_CM = 15.0f;

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
  pinMode(LED_VAGA_1, OUTPUT);
  digitalWrite(LED_VAGA_1, LOW);
  // Pisca na inicialização para separar falha do LED de falha da leitura.
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_VAGA_1, HIGH); delay(250);
    digitalWrite(LED_VAGA_1, LOW); delay(250);
  }
  for (int i = 0; i < 3; i++) {
    pinMode(TRIG[i], OUTPUT);
    digitalWrite(TRIG[i], LOW);
    pinMode(ECHO[i], INPUT);
  }
  delay(1000);
  Serial.println("TESTE USB + LED GPIO13 | S01=27/32, S02=26/33, S03=25/34 (TRIG/ECHO).");
}

void loop() {
  for (int i = 0; i < 3; i++) {
    float cm = medirCm(i);
    if (i == 0) {
      bool acender = cm >= 2 && cm <= LIMIAR_LED_CM;
      digitalWrite(LED_VAGA_1, acender ? HIGH : LOW);
      Serial.printf("LED GPIO13: %s (controlado somente pelo S01)\n", acender ? "LIGADO" : "DESLIGADO");
    }
    if (cm < 0) Serial.printf("S%02d: SEM LEITURA VALIDA\n", i + 1);
    else Serial.printf("S%02d: %.1f cm\n", i + 1, cm);
    delay(80); // Separa disparos para reduzir interferência entre sensores.
  }
  Serial.println("---");
  delay(1000);
}
