# Protótipo físico VAGGU — três vagas

## Parecer de viabilidade — 19/10/2026

**Viável para bancada/maquete, com adaptação de firmware.** Foi analisada a pasta `C:\Users\pietr\Downloads\vaggu-esp32-demo (2)\vaggu-esp32-demo`. O demo tem servidor em memória e tela própria; não deve substituir a API e o mapa do projeto principal. O firmware nesta pasta envia diretamente para a API existente, preservando PostgreSQL, autenticação por placa e isolamento por shopping. Não exige migration ou mudança de contrato.

| Item | Demo recebido | Integração preparada |
| --- | --- | --- |
| Destino | `/api/v1/dispositivos/telemetria` | `/api/v1/telemetria/estados` e `/heartbeat` |
| Credencial | `x-device-key`, chave compartilhada | `Authorization: Device <chave individual>` |
| Identidade | `dispositivo`, números de vagas | `placaCodigo`, `sensorCodigo`, inicialização e sequência |
| Falha de leitura | `DESCONHECIDA` | Sensor omitido; expira para `INDISPONIVEL` |
| Confirmação | Estado imediato em memória | 30 segundos consistentes na API |
| Distância | Exibida no demo | Usada localmente; API recebe somente estado |
| Dados | Memória, desaparecem no reinício | PostgreSQL do Vaggu |

Limite: isto prepara o ensaio; não comprova detecção em estacionamento real. Modelo exato da placa, sensores disponíveis, posicionamento e calibração precisam ser conferidos na bancada. O firmware foi escrito para **ESP32 clássico DevKit/WROOM-32 + HC-SR04 de 5 V**. Não usar a mesma pinagem em ESP32-C3/S3, WROVER ou outra placa sem conferir o pinout.

## Material e montagem

### Primeiro teste agora: USB e distâncias, sem LEDs

Use primeiro o sketch [teste_sensores_usb.ino](teste_sensores_usb/teste_sensores_usb.ino). Ele não exige config.h, senha, Wi-Fi, backend ou banco e não envia dados ao Vaggu. Abra-o no Arduino IDE, instale o core ESP32 conforme a seção de gravação, selecione a placa compatível com a DevKit V1 e a porta COM, verifique e grave. Abra o Monitor Serial a 115200 baud e pressione EN/reset se necessário.

Pinagem: TRIG 25/26/27, ECHO após divisores 32/33/34. Aponte um objeto plano para cada sensor a cerca de 10 cm e depois 25–30 cm; a leitura do canal correspondente deve mudar de forma coerente, sem exigir precisão exata. Não interprete SEM LEITURA VALIDA como vaga livre. Confira vários ciclos, primeiro em cada canal separadamente e depois nos três, antes de seguir para a integração. Registre as distâncias vazia/ocupada para calibrar os limiares. Se houver falha, desligue o USB antes de mexer em fios. Se o upload falhar na conexão, tente BOOT durante Connecting, confirme cabo de dados e porta COM.

Depois deste ensaio, grave o firmware `vaggu_3_vagas` seguindo as etapas de provisionamento e configuração abaixo. Ele está com `USAR_LEDS = false`, conforme decisão atual. A seção de LEDs é opcional e só deve ser ativada mudando essa constante para true após a montagem correspondente. A compilação Arduino e o teste físico dos dois sketches ainda não foram executados neste ambiente.

Equipamento informado pelo usuário: **ESP32 DevKit V1**; alimentação futura com **quatro pilhas Ni-MH, capacidade declarada de 4700 mAh cada**. Confira a marcação WROOM-32 no módulo e os GPIOs impressos na placa antes de aplicar a pinagem abaixo; DevKit V1 tem variantes de fabricante.

- 1 ESP32 DevKit com WROOM-32, cabo USB de dados e computador.
- 3 HC-SR04 de 5 V, protoboard e jumpers curtos.
- Divisores com os valores disponíveis: 3 resistores de 1 kΩ, 3 de 180 Ω e 3 de 2,2 kΩ; confirmar valores com multímetro.
- Até 3 LEDs indicadores comuns de dois terminais, preferencialmente vermelhos, cada um com resistor individual de 1 kΩ. Das cinco unidades de 1 kΩ informadas, sobram duas após os divisores: dois LEDs podem ser montados agora; o terceiro exige mais um resistor de 1 kΩ.
- Alimentação regulada de 5 V apropriada aos sensores, multímetro e rede Wi-Fi de 2,4 GHz sem isolamento de clientes.
- Três posições na maquete e objetos/carrinhos para os testes.

**Montagem atual solicitada: somente USB da ESP32, sem pilhas nem fonte externa.** Nas variantes da DevKit V1 em que VIN/5V está ligado à alimentação USB, esse pino pode alimentar o barramento dos sensores. Como há clones diferentes, primeiro confira no esquema da placa ou meça entre VIN/5V e GND com apenas USB conectado: deve haver tensão próxima de 5 V. Não use 3V3 para alimentar os HC-SR04 de 5 V. Se VIN não fornecer tensão adequada, não prossiga assumindo que seja saída de 5 V.

Depois dessa conferência, retire o USB para montar: ligue VIN/5V ao barramento vermelho e GND ao azul. Ligue os três VCC ao vermelho e os três GND ao azul; mantenha TRIG e divisores de ECHO conforme a tabela. Reconecte o USB somente após revisar a montagem. Use cabo USB curto e de boa qualidade; teste primeiro um sensor e depois três, verificando tensão sob carga e ausência de reinicializações. A capacidade disponível depende da porta USB, cabo e placa; esta montagem ainda precisa ser validada na bancada. Não conecte fonte externa ao barramento nesta configuração.

O HC-SR04 usa 5 V e seu ECHO precisa de redução antes de entrar no GPIO do ESP32. O divisor abaixo produz aproximadamente 3,25 V a partir de 5 V: 1 kΩ + 180 Ω em série acima do ponto de leitura e 2,2 kΩ abaixo. Confira a alimentação e a montagem antes de conectar o GPIO. Referências: [datasheet ESP32](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf) e [datasheet HC-SR04](https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf).

| Sensor | Vaga exemplo | TRIG direto | ECHO através do divisor | Código provisionado |
| --- | --- | --- | --- | --- |
| 1 | A01 | GPIO25 | GPIO32 | VAGGU_ESP32_01-S01 |
| 2 | A02 | GPIO26 | GPIO33 | VAGGU_ESP32_01-S02 |
| 3 | A03 | GPIO27 | GPIO34 | VAGGU_ESP32_01-S03 |

Os números são **GPIO**, não a posição física do conector. A pinagem foi alterada em relação ao demo para evitar GPIO5, que participa da configuração de boot do ESP32 clássico.

### Diagrama elétrico — repetir para cada sensor

```text
VIN/5V da ESP32* ------------------------ VCC HC-SR04
GND ESP32 --------+---------------------- GND HC-SR04
                  +---------------------- GND ESP32

GPIO TRIG -------------------------------- TRIG HC-SR04

ECHO HC-SR04 --[1 kΩ]--[180 Ω]--+---------- GPIO ECHO
                            |
                          [ 2,2 kΩ ]
                            |
GND comum ------------------+

Computador USB --------------------------- ESP32 (alimentação e programação)

* Confirmar que VIN/5V fornece aproximadamente 5 V a partir do USB.
```

Cada ECHO tem seu próprio conjunto de três resistores. Os três VCC vão ao barramento alimentado por VIN/5V conferido; todos os GND ao mesmo barramento. Não conecte ECHO diretamente ao ESP32.

### LEDs por vaga

O sketch foi preparado para três LEDs comuns de dois terminais, um por vaga. GPIO13 indica A01, GPIO14 indica A02 e GPIO23 indica A03. Cada saída exige seu próprio resistor em série de 1 kΩ; um LED vermelho típico fica com corrente aproximada de 1–2 mA, podendo apresentar brilho discreto. LEDs azuis/brancos podem ficar fracos em 3,3 V. Não aplicar este circuito a fitas, LEDs de potência ou módulos de 12 V. [Referência de limitação de corrente em LEDs](https://learn.sparkfun.com/tutorials/resistors/example-applications).

```text
GPIO13 --[1 kΩ]-- anodo (+) LED A01 catodo (−) -- GND
GPIO14 --[1 kΩ]-- anodo (+) LED A02 catodo (−) -- GND
GPIO23 --[1 kΩ]-- anodo (+) LED A03 catodo (−) -- GND
```

Em LEDs novos de dois terminais, a perna longa geralmente é o anodo; a curta e o lado achatado do encapsulamento indicam o catodo. Se as pernas foram cortadas, confira no modo diodo do multímetro. Coloque cada perna em uma fileira diferente na protoboard. Não conectar LED direto ao GPIO nem unir os sinais das três saídas.

Com o inventário informado (cinco de 1 kΩ), monte os dois primeiros LEDs com os dois resistores que sobraram e deixe GPIO23 sem conexão até obter mais um resistor de 1 kΩ. Não remova resistores dos divisores de ECHO. O código pode permanecer com as três saídas configuradas.

**LED aceso significa ocupação detectada localmente, antes da confirmação de 30 s da API.** Apagado não comprova vaga livre: também ocorre sem leitura válida, no início e quando o loop identifica Wi-Fi desconectado ou bloqueio de autenticação/contrato. O firmware atual só inicia medições após Wi-Fi e primeiro heartbeat aceito. Um timeout HTTP isolado não é indicado pelo LED; ele não comprova entrega ao servidor.

Teste após gravar: coloque um objeto sob S01, S02 e S03 separadamente e confirme que apenas o LED correspondente acende; retire o objeto e confira liberação conforme os limiares. No ciclo com falha de leitura, o respectivo LED deve apagar. Montagem, brilho e compilação Arduino continuam pendentes de verificação física.

### Diagrama de integração

```text
HC-SR04 S01 ─┐                         ┌─ confirmação de 30 s
HC-SR04 S02 ─┼─ ESP32 ─ Wi-Fi ─ Express ─ Prisma ─ PostgreSQL
HC-SR04 S03 ─┘         HTTP local        └─ expiração individual
                                      ↑
                                navegador VAGGU
                               mapa do shopping
```

### Posição dos sensores

```text
Vista lateral de uma vaga:       Vista superior:
suporte ─ [sensor ↓]             [S01 ↓]   [S02 ↓]   [S03 ↓]
             |                  ┌──────┐ ┌──────┐ ┌──────┐
       teto do carrinho          │ A01  │ │ A02  │ │ A03  │
──────── piso/refletor ─────     └──────┘ └──────┘ └──────┘
```

Monte o sensor apontado para uma superfície detectável quando a vaga estiver vazia. Ausência de eco é falha, não evidência de vaga livre. Comece com piso a cerca de 25–35 cm e objeto a 5–12 cm, ajustando conforme as leituras reais. Evite distância abaixo de 2 cm, superfícies inclinadas/absorventes e sensores voltados uns para os outros. Não há escala definida no desenho.

## Alimentação futura com quatro Ni-MH

Considerando pilhas de 1,2 V nominal, ligadas em série, o conjunto tem **4,8 V nominais e 4700 mAh declarados**, não 18.800 mAh. A energia nominal calculada é 4,8 × 4,7 = **22,56 Wh**, condicionada à capacidade real das pilhas. A tensão varia com carga e descarga; não equivale a uma fonte regulada de 5 V.

Use um **conversor DC-DC buck-boost com saída regulada de 5 V**, capaz de elevar e reduzir a tensão. Como requisito de seleção para a bancada, procure faixa de entrada que cubra pelo menos 4–6 V e capacidade contínua de saída de 1 A nas condições reais de entrada, com proteção contra curto/sobrecorrente. Não confunda corrente de pico do anúncio com corrente contínua. Um boost simples pode deixar passar uma tensão de entrada acima de 5 V; um buck simples não sustenta 5 V quando o pack cair abaixo disso. [Exemplo técnico de regulação para quatro Ni-MH](https://www.pololu.com/product/2119/) — referência de topologia, não indicação de que esse módulo específico entrega 1 A.

```text
4 Ni-MH em série (+) ─ fusível ─ chave ─ IN+ [buck-boost 5 V] OUT+ ─┬─ VCC dos 3 HC-SR04
                                                                 └─ alimentação USB da ESP32*
4 Ni-MH em série (−) ────────────────── IN−                  OUT− ─── GND comum

* Cabo/adaptador USB de alimentação apropriado, com polaridade conferida.
  Alternativa: entrada VIN/5V, somente após conferir o esquema da placa exata.
```

Ajuste e meça os 5 V do conversor antes de conectar a eletrônica e confira novamente sob carga. Não aplique o pack ou os 5 V ao pino 3V3. Defina o fusível em função dos fios, suporte e corrente real; evite curto no suporte. Para programar pelo USB do computador, desligue e desconecte a alimentação externa da ESP32 primeiro; não presuma que a DevKit V1 possui seleção automática segura entre fontes.

Use pilhas iguais (marca, modelo, capacidade e estado de carga) e carregador próprio para Ni-MH. A DevKit e o conversor não carregam as pilhas. Preveja desligamento por bateria fraca conforme o fabricante das células, evitando descarga excessiva/inversão da célula mais fraca; não transplante limites ou carregadores de lítio para Ni-MH.

**Autonomia só pode ser estimada após medir o conjunto.** Exemplo matemático, não consumo medido: se ESP32 + sensores consumirem em média 250 mA na saída de 5 V, com eficiência de 85%, a conta nominal seria 22,56 × 0,85 ÷ (5 × 0,25) ≈ **15 horas**. Capacidade real, autodescarga, limite de desligamento e picos do Wi-Fi reduzem/alteram o resultado. Os 4700 mAh são informação do rótulo, ainda não verificada por ensaio. O firmware atual mantém Wi-Fi ativo; deep sleep exige rever os intervalos de confirmação e expiração da API.

## 1. Preparar o sistema principal

Use um shopping de testes próprio, separado dos dados operacionais. **Não use o Shopping Exemplo sintético**: ele recebe tratamento especial de expiração e prejudica o ensaio de falhas. Siga primeiro o [guia de configuração do Vaggu](../../segunda-mente/Vaggu/Documentação/configuracao.md) para instalar dependências, configurar `.env`, banco e Admin. Nunca execute limpeza/reset de banco para esta montagem.

No painel Admin, crie ou selecione o shopping de testes, um andar, um setor e três vagas ativas com códigos `A01`, `A02`, `A03`. Copie o ID real do shopping (identificador interno, não seu nome), pela resposta de consulta de shoppings no DevTools/Network ou pelo Prisma Studio (`npm.cmd run db:studio`, sem editar tabelas manualmente). As vagas devem estar sem sensor anterior. Se já existir vínculo, use outras vagas de teste.

Em PowerShell:

```powershell
Set-Location 'C:\Users\pietr\Documents\Vaggu\vaggu-backend'
npm.cmd ci
npm.cmd run db:setup
$env:HOST = '0.0.0.0'
npm.cmd run build
npm.cmd start
```

`db:setup` aplica migrations: confira antes que `DATABASE_URL` no `.env` é a base desejada de testes. O HOST é necessário porque o padrão `127.0.0.1` não aceita conexão do ESP32. Não inicie o backend do demo na mesma porta.

Em outro PowerShell, localize o IPv4 do computador com `ipconfig`. Use o adaptador da mesma rede do ESP32, não VPN, loopback ou um IP copiado do exemplo. Confira:

```powershell
Invoke-RestMethod 'http://localhost:3000/api/v1/health/ready'
# Substitua pelo IPv4 real:
Invoke-RestMethod 'http://192.168.1.100:3000/api/v1/health/ready'
```

Teste a segunda URL também no navegador de um celular na mesma rede. Se falhar, confira HOST, IP, rede de convidados/isolamento e Firewall do Windows. Permita Node.js/porta 3000 somente na rede privada confiável, sem desativar o firewall inteiro. HTTP expõe a chave na rede: use esta configuração apenas na bancada privada. O firmware fornecido não implementa HTTPS; para serviço publicado, adicionar cliente TLS com validação de certificado, sem `setInsecure()`.

## 2. Provisionar uma placa e três sensores

Em outro terminal, dentro de `vaggu-backend`:

```powershell
$env:PLACA_SHOPPING_ID = 'COLE_O_ID_REAL_DO_SHOPPING_DE_TESTES'
$env:PLACA_CODIGO = 'VAGGU_ESP32_01'
$env:PLACA_NOME = 'Bancada fisica de tres vagas'
$env:PLACA_VAGAS_CODIGOS = 'A01,A02,A03'
npm.cmd run telemetria:provisionar
```

A ordem associa S01→A01, S02→A02 e S03→A03. Copie a chave exibida uma única vez e guarde localmente. Não envie a chave para chat, Git, screenshots ou frontend. Não rode novamente esperando recuperar a chave: o script recusa código de placa existente. Se já existir `VAGGU_ESP32_01`, escolha um código novo e use-o também no firmware; os sufixos S01–S03 são montados automaticamente.

## 3. Testar o contrato antes dos fios

Opcionalmente execute o simulador existente para separar problema de API de problema elétrico:

```powershell
$env:SIMULADOR_API_URL = 'http://127.0.0.1:3000/api/v1'
$env:SIMULADOR_PLACA_CODIGO = $env:PLACA_CODIGO
$credencialBancada = Read-Host 'Chave da placa' -AsSecureString
$env:SIMULADOR_PLACA_CHAVE = [System.Net.NetworkCredential]::new('', $credencialBancada).Password
$env:SIMULADOR_SENSORES_CODIGOS = 'VAGGU_ESP32_01-S01,VAGGU_ESP32_01-S02,VAGGU_ESP32_01-S03'
$env:SIMULADOR_INTERVALO_MS = '10000'
npm.cmd run telemetria:simular
Remove-Item Env:SIMULADOR_PLACA_CHAVE
```

Adapte os três códigos se mudou a placa. Esse cenário dura cerca de 20 s e serve para validar aceitação HTTP; sozinho não cobre a janela inteira de 30 s. Pare o simulador antes de ligar o firmware: dois emissores com a mesma identidade de placa disputam a inicialização. O ensaio físico abaixo valida a confirmação completa.

## 4. Gravar o ESP32

1. Instale Arduino IDE e o pacote **esp32 by Espressif Systems** seguindo a [instalação oficial](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html).
2. Abra `vaggu_3_vagas/vaggu_3_vagas.ino`. Copie `config.example.h` para `config.h` na mesma pasta; este último é ignorado pelo Git.
3. Preencha SSID/senha de rede 2,4 GHz, `API_BASE` com IPv4 real e caminho `/api/v1/telemetria`, código e chave provisionados. Não coloque barra ao final da URL. Não use `localhost` no ESP32.
4. Selecione a placa correspondente ao modelo físico (por exemplo, ESP32 Dev Module para DevKit WROOM compatível) e a porta COM correta. Compile com **Verificar** antes do upload. O sketch usa bibliotecas do próprio core, sem ArduinoJson.
5. Grave com os sensores ainda desconectados. Se a placa exigir, mantenha BOOT durante o início do upload e solte quando começar a gravação.
6. Desligue a alimentação, monte primeiro S01 com divisor e confira a fiação; depois energize. Abra Serial Monitor em **115200 baud**.
7. Confira distâncias e respostas HTTP. Depois desligue, conecte S02/S03 com seus divisores e repita. Os sensores ausentes serão omitidos até a conexão.

O primeiro evento é heartbeat de sequência zero; ele só avança após HTTP 200/202. Uma reinicialização cria outro `inicializacaoId`. Os ciclos seguintes usam sequência crescente e leituras novas, sem reenviar medições antigas depois de um timeout. Todos os sensores inválidos resultam somente em heartbeat; isso não renova a validade das vagas. Não é necessário sincronizar relógio: o backend usa o horário de recebimento.

## 5. Calibrar e observar no mapa

O firmware mede em sequência, com pausas de 65 ms entre disparos, usa mediana de três amostras e só aceita um grupo com três leituras válidas. O intervalo entre envios saudáveis é aproximadamente 4 s; falhas de rede podem ampliar esse tempo. A API exige lacunas menores que 15 s por padrão para continuar uma confirmação.

Observe cada sensor vazio e ocupado pelo Serial Monitor. Ajuste separadamente `OCUPAR_CM` e `LIBERAR_CM`: o limiar de ocupação deve ser menor que o de liberação e ambos devem separar claramente as medidas reais. Padrões iniciais: ocupa em ≤15 cm, libera em ≥18 cm. Entre eles mantém o estado detectado; após boot/falha, a faixa intermediária é omitida até haver leitura conclusiva.

Abra o frontend principal (`npm.cmd run dev` em `vaggu-frontend`, após instalar dependências) e entre como Admin ou gerente do shopping de teste. No mapa, selecione o andar e a vaga; acompanhe placa, observação e confirmação pendente. **Recarregue o mapa/página para buscar novas leituras**: o mapa administrativo/gerencial ainda não tem atualização automática periódica. A prévia de telão tem consulta periódica própria de 30 s.

O estado confirmado pode permanecer anterior durante a janela de mudança: não espere alteração instantânea. Mantenha a situação por pelo menos **40 s** em cada etapa e consulte novamente. Nas configurações padrão, o sensor silencioso vence após **120 s**; a persistência do job pode demorar mais **30 s**. A consulta do mapa também aplica validade individual.

## 6. Roteiro de aceite da bancada

| Ensaio | Ação | Resultado esperado após consultar novamente |
| --- | --- | --- |
| Inicialização | Ligar sem objeto, com piso detectável | HTTP 202/200, observações reais; livres após confirmação de 30 s |
| Isolamento | Ocupar só A01 por ≥40 s | Apenas A01 ocupada; A02/A03 livres |
| Três canais | Repetir em A02 e A03 e depois ocupar todas | Canais corretos; três ocupadas após confirmação |
| Liberação | Remover um objeto por ≥40 s | Somente a vaga correspondente livre |
| Oscilação | Alternar objeto em menos de 30 s | Não consolidar cada oscilação como mudança |
| Falha individual | Desligar tudo, desconectar um sensor e religar | Outros seguem; sensor ausente fica indisponível após validade; heartbeat não o mantém livre |
| Wi-Fi ausente | Desligar Wi-Fi ou AP por >150 s | Todas indisponíveis ao consultar; sem falsa indicação de livre |
| Recuperação | Restaurar rede/sensor e aguardar ≥40 s | Retoma comunicação e confirma leituras novas |
| Reinício | Pressionar EN/reset | Novo identificador de boot e sequência inicial zero aceita |
| Persistência | Reiniciar API preservando banco | Cadastros/histórico permanecem; confirmar dados novos após retomada |

Não retire fios energizados para simular falhas. Registre horário, vaga, distância no Serial, código HTTP, estado observado/confirmado, duração e screenshot sem segredos. Rode cada combinação pelo menos três vezes. Estes resultados ainda precisam ser coletados fisicamente.

## Diagnóstico

| Sinal | Conferir |
| --- | --- |
| Só aguarda Wi-Fi | SSID/senha, 2,4 GHz, alcance e alimentação |
| HTTP negativo/timeout | IP, HOST, servidor ativo, firewall e isolamento do AP |
| 404 | API_BASE deve terminar em `/api/v1/telemetria`; não usar rota do demo |
| 401 | Chave individual e código provisionado; depois reiniciar placa |
| 403 | Códigos S01/S02/S03 pertencentes à placa e shopping |
| 400/409 | Corpo/ordem recusados; parar simulador concorrente, conferir resposta e reiniciar |
| -1 cm | Sem eco válido: alimentação, GND, divisor, pinos, posição e superfície |
| Confirmação nunca conclui | Oscilação, timeout ou intervalo >15 s; calibrar e verificar rede |
| API aceita mas tela parece parada | Shopping/andar correto e nova consulta do mapa |

## Verificação desta entrega

Contrato conferido com `src/telemetria/contratos.ts`, rotas, serviço e script de provisionamento do backend. Build TypeScript, cinco testes existentes de contrato/rotas de telemetria e verificador documental aprovados. Os testes HTTP precisaram de execução com acesso a loopback fora da restrição inicial do ambiente. Não houve novo ensaio PostgreSQL nesta entrega. Não havia `arduino-cli` ou compilador Arduino disponível no ambiente: **compilação no core ESP32, upload e ensaio elétrico permanecem pendentes**. Não foram criados registros no banco nem alteradas credenciais reais durante esta preparação.
