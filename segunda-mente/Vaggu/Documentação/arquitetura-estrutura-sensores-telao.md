# Estrutura, sensores e telões da VAGGU

## Configuração do estacionamento

O Admin configura a hierarquia `Shopping → Andar → Setor → Vaga`. Um shopping aceita vários andares; cada andar aceita vários setores; cada setor aceita várias vagas. A vaga possui código único no shopping e tipo `COMUM`, `PCD`, `IDOSO` ou `ELETRICA`. O tipo não representa ocupação.

O cadastro manual atende estruturas pequenas. O P05 acrescentará importação CSV/XLSX com prévia e confirmação. A importação deve preservar os IDs das vagas existentes e nunca apagar histórico por ausência de uma linha.

## Mapa

Cada andar possui uma revisão do mapa. A posição da vaga usa `x`, `y`, largura e altura normalizados entre zero e um, além de rotação em graus. Essas proporções mantêm a posição em telas diferentes. Toda posição referencia uma vaga do mesmo andar, setor e shopping. A API exige a revisão esperada ao salvar e rejeita gravações concorrentes, evitando sobrescrita silenciosa.

## Sensores e estado

No P06, cada canal de sensor será associado a uma vaga já cadastrada. A placa ESP32 se autentica e envia identidade de inicialização, sequência, sensor, estado medido e instante. O backend deriva o shopping pela credencial, valida pertencimento, ordem e idempotência, aplica a confirmação consistente e registra histórico. Evento duplicado não cria nova observação; evento antigo não regride estado; silêncio expira o sensor e nunca transforma dado vencido em vaga livre.

## Mapa operacional e telões

O mapa consulta o estado atual por vaga e recebe atualizações sem recarga manual. O P07 produzirá contagens agregadas por shopping, andar e setor para os telões. PCD, idoso e elétrica fazem parte do total geral e aparecem como recortes, sem soma duplicada. O telão recebe apenas agregados autorizados e validade dos dados, sem sessões administrativas ou dados pessoais.

O transporte em tempo real será validado na infraestrutura. A proposta inicial é Server-Sent Events ou WebSocket, com nova consulta ao reconectar. O banco permanece a referência para recompor o estado; o canal em tempo real não substitui persistência nem isolamento.
