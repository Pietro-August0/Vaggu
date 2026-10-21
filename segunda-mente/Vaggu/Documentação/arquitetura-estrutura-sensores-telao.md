# Estrutura, sensores e telões da VAGGU

## Configuração do estacionamento

O Admin configura a hierarquia `Shopping → Andar → Setor → Vaga`. Um shopping aceita vários andares; cada andar aceita vários setores; cada setor aceita várias vagas. A vaga possui código único no shopping e tipo `COMUM`, `PCD`, `IDOSO` ou `ELETRICA`. O tipo não representa ocupação.

O cadastro manual atende estruturas pequenas. O P05 acrescentou leitura CSV/XLSX, validação, persistência da prévia e confirmação idempotente. A aplicação preserva os IDs e o histórico das vagas existentes e não remove uma vaga apenas porque sua linha está ausente da planilha.

## Mapa

Cada andar possui uma revisão do mapa. A posição da vaga usa `x`, `y`, largura e altura normalizados entre zero e um, além de rotação em graus. Essas proporções mantêm a posição em telas diferentes. Toda posição referencia uma vaga do mesmo andar, setor e shopping. A API exige a revisão esperada ao salvar e rejeita gravações concorrentes, evitando sobrescrita silenciosa.

## Sensores e estado

Na base atual do P06, cada sensor é ligado a uma vaga já cadastrada. A placa ESP32 se identifica e envia a leitura de cada sensor em uma ordem controlada. O servidor confere se tudo pertence ao mesmo shopping, ignora mensagens repetidas ou antigas, espera leituras consistentes antes de mudar o estado e guarda o histórico. Se um sensor parar de responder, a vaga fica indisponível; ela nunca é mostrada como livre por falta de informação. Essa parte já foi testada com PostgreSQL. A consulta visual de monitoramento e o detalhe por vaga já existem. Cadastro/vínculo e manutenção/ocorrências estão implementados; faltam ESP32 real, tempos definitivos e homologação publicada.

## Mapa operacional e telões

O mapa consulta o estado e a validade individual com atualização a cada 15 segundos, pausa durante a edição e invalidação após 30 segundos ou falha de conexão. Os 30 segundos de app-store verificam a sessão e são independentes da atualização operacional. PCD, idoso e elétrica fazem parte do total e aparecem como recortes sem soma duplicada. A instalação web de telão usa credencial própria revogável e retorna apenas agregados autorizados, sem sessões administrativas ou dados pessoais.

O Admin configura equipamentos e telões em `/admin/shoppings/:shoppingId/estrutura`, na área de configuração. A página instalada `/telao/:id` consulta `GET /api/v1/teloes/:id/disponibilidade` com autorização própria a cada 15 segundos. O hash da chave fica persistido; a chave original é emitida na criação. A homologação publicada e a instalação física seguem pendentes. O banco continua sendo a referência e ausência de conexão nunca mantém um número como disponibilidade atual.


### Registro histórico — prévia autenticada em 17/10/2026

Na entrega de 17/10, a interface do gerente passou a incluir uma prévia por andar e setor. Ela consulta `GET /api/v1/estacionamento/estrutura` no escopo do cookie de sessão, a cada 30 segundos, e soma somente vagas com leitura válida (`OPERANDO` ou `CONFIRMANDO`) e estado confirmado livre/ocupado. Vagas sem sensor, desconhecidas ou indisponíveis ficam fora da contagem de livres e geram aviso. Falha de consulta oculta os números até a próxima resposta válida. Dados do Shopping Exemplo ficam identificados como demonstração.

Esse era o limite da prévia em 17/10. A instalação autorizada e o recorte configurável foram implementados posteriormente, como descrito acima; atualização por evento não é necessária ao transporte atual por polling.
