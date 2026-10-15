# Estrutura, sensores e telões da VAGGU

## Configuração do estacionamento

O Admin configura a hierarquia `Shopping → Andar → Setor → Vaga`. Um shopping aceita vários andares; cada andar aceita vários setores; cada setor aceita várias vagas. A vaga possui código único no shopping e tipo `COMUM`, `PCD`, `IDOSO` ou `ELETRICA`. O tipo não representa ocupação.

O cadastro manual atende estruturas pequenas. O P05 acrescentou leitura CSV/XLSX, validação, persistência da prévia e confirmação idempotente. A aplicação preserva os IDs e o histórico das vagas existentes e não remove uma vaga apenas porque sua linha está ausente da planilha.

## Mapa

Cada andar possui uma revisão do mapa. A posição da vaga usa `x`, `y`, largura e altura normalizados entre zero e um, além de rotação em graus. Essas proporções mantêm a posição em telas diferentes. Toda posição referencia uma vaga do mesmo andar, setor e shopping. A API exige a revisão esperada ao salvar e rejeita gravações concorrentes, evitando sobrescrita silenciosa.

## Sensores e estado

Na base atual do P06, cada sensor é ligado a uma vaga já cadastrada. A placa ESP32 se identifica e envia a leitura de cada sensor em uma ordem controlada. O servidor confere se tudo pertence ao mesmo shopping, ignora mensagens repetidas ou antigas, espera leituras consistentes antes de mudar o estado e guarda o histórico. Se um sensor parar de responder, a vaga fica indisponível; ela nunca é mostrada como livre por falta de informação. Essa parte já foi testada com PostgreSQL. A consulta visual de monitoramento e o detalhe por vaga já existem. Faltam ESP32 real, tempos definitivos, cadastro/vínculo de equipamentos e comandos/ocorrências de manutenção.

## Mapa operacional e telões

O mapa consulta o estado e a validade individual ao carregar a estrutura; mutações administrativas fazem refetch. Novas leituras recebidas do ESP32 ainda não atualizam automaticamente uma tela já aberta. O intervalo de 30 segundos em app-store verifica a sessão, não a ocupação das vagas. O P07 produzirá contagens agregadas por shopping, andar e setor para os telões. PCD, idoso e elétrica fazem parte do total geral e aparecem como recortes, sem soma duplicada. O telão recebe apenas agregados autorizados e validade dos dados, sem sessões administrativas ou dados pessoais.

A forma de atualizar as telas em tempo real ainda será escolhida e testada no ambiente publicado. Independentemente da opção, o banco continuará sendo a referência: se a conexão cair, a tela deve consultar os dados novamente sem misturar informações de shoppings diferentes.
