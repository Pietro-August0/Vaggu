---
tags: [vaggu, hardware, esp32, evidencias]
---
# Ensaio físico integrado da bancada — 10/11/2026

**Resultado: ensaio local concluído e aceito pela equipe.** A equipe confirmou que a montagem e o teste funcionaram. O vídeo integrado mostra a resposta dos indicadores físicos e das três vagas no painel: livre → ocupada → livre. O aceite refere-se ao protótipo alimentado por USB na bancada local.

## Montagem e ajustes

Foram usados ESP32 DevKit V1, três HC-SR04, dois LEDs por vaga, protoboards, jumpers e resistores. As fotos mostram a placa e a fiação, os três sensores alinhados e a estrutura da maquete com três vagas demarcadas. A foto da estrutura documenta a preparação mecânica; o ensaio integrado gravado foi feito com o circuito sobre a mesa.

| Vaga local | Canal | TRIG | ECHO com divisor | LED vermelho | LED verde |
| --- | --- | --- | --- | --- | --- |
| A01 | S01 | GPIO27 | GPIO32 | GPIO13 | GPIO18 |
| A02 | S02 | GPIO26 | GPIO33 | GPIO14 | GPIO19 |
| A03 | S03 | GPIO25 | GPIO34 | GPIO23 | GPIO21 |

A ligação de referência usa VCC dos sensores em 5 V conferido, GND comum e divisor individual no ECHO: 1 kΩ + 180 Ω em série antes do GPIO e 2,2 kΩ do GPIO ao GND. Cada LED usa um resistor próprio de 1 kΩ em série. Os valores foram registrados conforme a montagem orientada; não foram inferidos pelas fotos.

Para reduzir interferência entre sensores próximos, o firmware dispara um sensor por vez, espera 120 ms de silêncio após cada tentativa e exige um par coerente entre três amostras. O indicador local fica vermelho até 15 cm, verde a partir de 18 cm e mantém o estado anterior no intervalo. Sem leitura válida, ambos os LEDs da vaga apagam e aquele canal é omitido no envio. O sketch de teste isolado dos LEDs ajudou a separar o acionamento dos GPIO da leitura dos sensores.

## Fluxo e verificação

1. A ESP32 envia a telemetria pela rede do hotspot de 2,4 GHz à API local. A API autentica a placa de bancada e registra o estado no PostgreSQL.
2. A janela mínima de confirmação local foi ajustada de 2 s para 1 s, mantendo leituras consistentes e lacuna máxima de 4,5 s. O mapa do gerente consulta a cada 500 ms. Os LEDs mostram a detecção local antes de o painel exibir a confirmação do servidor.
3. Após gravar na COM3, o Serial mostrou os três sensores válidos no mesmo ciclo: 92,6 cm, 90,1 cm e 89,0 cm. Após reconectar o Wi-Fi, seis intervalos de lotes reais no banco ficaram entre 1.520 e 1.649 ms. O histórico registrou ocupação e liberação de A01, A02 e A03.
4. No vídeo integrado, o painel começa com as três vagas verdes. Uma folha é colocada à frente do conjunto; os LEDs físicos passam a vermelho e, em seguida, as três vagas também. Depois da retirada, LEDs e painel voltam a verde. O vídeo confirma o ciclo coletivo; não foi usado para cronometrar o tempo ponta a ponta nem para provar isolamento entre vagas.

## Evidências do dia

Originais preservados em `ambiente.local/evidencias/2026-11-10-bancada-esp32/`, área local ignorada pelo Git. A data e os horários abaixo vêm dos nomes dos arquivos fornecidos; as durações foram obtidas dos vídeos. As gravações não foram publicadas no Memorial.

| Arquivo local | Origem | O que registra |
| --- | --- | --- |
| `montagem-detalhe.jpeg` | Foto 14:54:27 | Vista lateral da ESP32, protoboards, cabeamento e indicadores. |
| `maquete-tres-vagas.jpeg` | Foto 14:54:51 | Estrutura verde com três vagas demarcadas e pontos de montagem. |
| `montagem-frontal.jpeg` | Foto 14:55:08 | Vista dos três HC-SR04 alinhados e dos pares de LEDs. |
| `video-165704.mp4` | Vídeo 16:57:04, 11,73 s | Bancada em operação: LEDs verdes, passagem para vermelhos com aproximação da folha e retorno ao verde após retirada. |
| `video-170458.mp4` | Vídeo 17:04:58, 14 s | Bancada e painel do Vaggu lado a lado, com a transição completa das três vagas e seus indicadores. |

Ver também o [guia da bancada](../../../hardware/esp32-3-vagas/README.md) e o [índice de evidências](../Evidências%20visuais/Índice%20de%20evidências.md). A compilação Arduino, a gravação verificada, os dez testes de confirmação e rotas e a resposta da API local com banco conectado foram registrados no [planejamento](planejamento-do-projeto.md).

O ensaio não inclui operação prolongada, alimentação por pilhas nem validação da versão mais recente do firmware no ambiente hospedado.
