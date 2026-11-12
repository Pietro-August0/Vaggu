# Cenário fictício para apresentação

**Atualização de novembro:** conexão, imagem/site e retorno do WhatsApp confirmados em 04/11. O código de 06/11 acrescenta a opção 6 demonstrativa; conferência publicada e captura real são separadas. A preparação de outubro abaixo não reabre a configuração já concluída.

**Situação vigente:** consulte a [revisão de pendências de 09/11](planejamento-do-projeto.md#revisão-de-pendências--09112026). O aceite web confirmado em 04/11 permanece encerrado. Registros anteriores preservam os limites daquela etapa; mudanças posteriores e aceite físico são separados.

O **Shopping Exemplo** contém cadastro institucional fictício completo, três gerentes com acessos individuais, dois pisos, quatro setores, 80 vagas posicionadas no mapa, quatro tipos de vaga e 15 dias de mudanças de estado para a análise e suas exportações. Também possui quatro placas e 80 sensores de apresentação, com situações e horários persistidos. Não há sensores ou ESP32 reais nesse shopping. Por decisão de 15/10, os avisos de origem fictícia foram retirados das telas e dos relatórios; a marcação técnica interna foi preservada.

O funcionamento e os testes do editor e dos sensores estão em [edição visual e monitoramento](edicao-visual-e-monitoramento.md).

## Formato da apresentação — atualizado em 11/11/2026

- **Slides:** apresentação Canva utilizada, fornecida pelo usuário em 09/11: [apresentação VAGGU](https://canva.link/pd7uk2f8llcr498). O link abriu no navegador com o título “TCC- Vaggu” e a capa da solução para estacionamentos de shoppings. Não foi realizada revisão completa dos slides nem edição do Canva.
- **Datas possíveis:** **30/11/2026 ou 03/12/2026**, conforme informado pelo usuário em 09/11; a escolha final e o horário permanecem sem confirmação.
- **Duração de referência:** **10 a 20 minutos**, conforme correção do usuário em 09/11; substitui a previsão anterior de 20–25 minutos. Ensaiar uma versão de 10 minutos e manter demonstrações complementares para o limite de 20.
- **WhatsApp:** conexão, menu e apresentação confirmados em 04/11. Demonstrar o percurso escolhido e conferir as seis opções da revisão de 05–06/11 no serviço publicado, com captura anonimizada. Não é necessário reabrir configuração Meta nem atendimento humano.
- **Telões:** apresentação breve, podendo usar uma interação ou fotos do formato. A escolha do formato ainda está aberta; fotos demonstram o layout, sem comprovar atualização operacional ao vivo. Esta escolha para a apresentação não encerra o pacote funcional de telões.
- **Power BI:** consideramos suficiente uma imagem com os modelos de gráficos nos slides. Não é necessária demonstração ao vivo de recebimento de dados, atualização do relatório ou integração com o site para esta apresentação. A imagem ilustra a proposta visual e não comprova uma integração funcional. Esta decisão reduz a exigência da apresentação; não encerra P09 nem altera automaticamente o escopo do produto.
- **Site:** ficará aberto durante a apresentação, com uma navegação breve para demonstrar seu uso. Telas, sequência e responsável pela navegação ainda precisam ser escolhidos.
- **Protótipo físico:** ESP32 DevKit V1 e três HC-SR04 com pares de LEDs; ciclo integrado local aceito em 10/11. O [ensaio registrado](ensaio-fisico-esp32-2026-11-10.md) separa o que foi comprovado dos limites. Carcaça/fixação final só precisam ser fechadas se forem usadas na apresentação.
- **Integração física:** a presença dos sensores na maquete não comprova, por si só, atualização das vagas no site. Esse fluxo precisa de teste próprio. O Shopping Exemplo descrito neste documento continua sendo sintético; não foi confirmado como destino da telemetria da maquete.

### Animação da chegada à atualização do telão

O [vídeo revisado para projeção](../Evidências%20visuais/2026-11-11%20-%20Animação%20revisada%20para%20apresentação/vaggu-do-shopping-ao-telao.mp4) tem 31 segundos, formato 16:9 e resolução 1920×1080. Foi montado para acompanhar a narração ao vivo, sem áudio nem legendas. O telão do andar e o mapa usam capturas locais com três vagas fictícias. O telão principal adapta a captura para mostrar a disponibilidade por andar.

| Tempo | Cena |
| --- | --- |
| 0–6,5 s | O motorista chega à cancela com um “?” sobre o carro. O telão principal indica uma vaga livre no Piso G1 e o carro avança quando a cancela sobe. |
| 6,5–10,5 s | No Piso G1, o motorista consulta o telão do andar, que indica o Setor A. |
| 10,5–16,5 s | O carro faz uma curva contínua para entrar na vaga A03 e freia já dentro dela. |
| 16,5–24 s | Cada sensor emite uma onda, recebe o eco do carro e envia a leitura ao mesmo ESP32. A placa transmite os dados ao sistema. |
| 24–27,5 s | O mapa destaca A03, que muda de livre para ocupada. |
| 27,5–31 s | O telão do andar muda de uma para zero vagas livres no setor A. |

A sequência é fictícia e usa tempos ilustrativos de leitura e atualização. Para renderizar novamente no Windows, instale Pillow e `imageio-ffmpeg`, preserve as quatro imagens `referencia-*.png` no destino e execute a partir da raiz:

```powershell
py scripts/gerar-animacao-apresentacao.py 'segunda-mente/Vaggu/Evidências visuais/2026-11-11 - Animação revisada para apresentação'
```

### Roteiro proposto para ensaio — 10 a 20 minutos

Distribuição sugerida para ajustar ao Canva existente, sem atribuir falas ou aprovações à equipe:

| Parte | Versão de 10 minutos | Versão de 20 minutos |
| --- | --- | --- |
| Problema e proposta | 2 min | 3 min |
| Funcionamento: sensor, ESP32, API e mapa | 2 min | 4 min |
| Navegação pelo site e análise | 3 min | 5 min |
| WhatsApp e demonstração física ensaiada | 2 min | 5 min |
| Resultado, limites e encerramento | 1 min | 3 min |

O roteiro é uma proposta, não confirmação do conteúdo dos slides. Se rede ou hardware falharem, usar as evidências estáticas identificadas como tais. O shopping sintético e a bancada física devem permanecer claramente separados.

### Informações dos sensores — responsável e retomada

Responsabilidade técnica registrada para Kamilly. Modelo, montagem e tempos observados estão no ensaio de 10/11; não aguardamos mais a definição do modelo. Falta ensaiar isolamento por sensor e duração sustentada, além da versão hospedada se ela for usada. Carcaça e alimentação final dependem da montagem escolhida.

### Preparação necessária do WhatsApp

Ensaiar o menu demonstrativo atual e registrar a captura anonimizada. A configuração real e o percurso inicial já foram confirmados; verificar somente as revisões posteriores. Definir quem conduz a conversa e manter alternativa gravada.

A integração atual permanece parcial conforme [guia do WhatsApp](whatsapp-webhook.md). A exigência de funcionamento na apresentação é uma meta confirmada, não uma declaração de implementação concluída. Segredos e códigos de ativação ficam fora da documentação e do Git.

## Aplicação automática no ambiente publicado

Na inicialização com `NODE_ENV=production`, a API garante a existência do exemplo na mesma conexão `DATABASE_URL` usada pelo site. Assim, a publicação já configurada no Render cria o exemplo no Neon sem acesso manual ao banco nem botão adicional na interface. A criação é atômica; reinicializações preservam senhas e histórico, inclusive com duas instâncias iniciando juntas.

O shopping aparece na lista administrativa. Para entrar como gerente, use a redefinição de senha já existente na ficha de Marina Azevedo (`marina.azevedo@aurora-demo.example`), Rafael Nogueira ou Camila Duarte. As senhas iniciais são aleatórias, armazenadas somente como hash e descartadas após a criação automática; não aparecem nos logs. A senha provisória emitida pelo Admin exige troca no primeiro acesso. A visualização continua protegida por login.

A migration `20261015000100_nome_shopping_exemplo` renomeia somente o cenário conhecido que ainda se chama Shopping Aurora — DEMONSTRAÇÃO. Ela preserva seus acessos e dados. Shoppings personalizados não são renomeados.

As posições das vagas são relativas ao piso inteiro: cada setor ocupa uma faixa própria, permitindo ver as 40 vagas do piso com o filtro “Todos os setores”. A migration `20261015000200_mapa_exemplo_sem_sobreposicao` corrige somente as coordenadas originais do exemplo já criado; posições editadas manualmente e outros shoppings são preservados. A revisão do mapa é incrementada nos pisos corrigidos para impedir que uma edição aberta antes da atualização sobrescreva as novas posições.

## Aplicação alternativa com conexão direta

1. Confirme que a migration `20261014000100_cenario_demonstracao` foi aplicada pelo deploy do Render.
2. Em um computador autorizado a acessar o Neon, configure `DEMO_DATABASE_URL` com a conexão **do banco publicado** por um mecanismo local de segredo. O script ignora `DATABASE_URL` e nunca imprime a conexão.
3. Execute na pasta `vaggu-backend`:

   ```powershell
   npm run demo:create -- --apply --credentials-file=../ambiente.local/credenciais-exemplo.local
   ```

   O arquivo de credenciais deve ainda não existir e terminar em `.local`. Ele é ignorado pelo Git e contém as três senhas provisórias geradas aleatoriamente. Guarde-o em local de acesso restrito aos integrantes autorizados e entregue cada senha por canal privado. O primeiro login exige troca de senha.

4. Entre com cada gerente, confira o mapa, a análise dos últimos sete dias, o filtro de até 31 dias e as exportações Excel/PDF. A conta VAGGU existente pode conferir o shopping e os três gerentes na administração.

O script não modifica shoppings existentes. Uma nova execução encontra o identificador fixo do cenário e encerra sem alterar dados nem senhas. Caso seja necessário atualizar o histórico para uma apresentação futura, prepare uma rotina de atualização específica para os registros fictícios; não recrie nem apague o cenário manualmente em produção.

## Verificação local

`npm run test:integracao` inclui o teste `cenario-apresentacao.test.ts`: ele cria o cenário em PostgreSQL descartável, confere estrutura, credenciais e análise e verifica que uma segunda execução não sobrescreve os acessos. Configure `.env.teste.local` com `TEST_DATABASE_URL` de um banco de controle dedicado; nunca use a conexão publicada. Sem essa configuração, `npm test` informa explicitamente que o cenário foi pulado.

## Limites do cenário

- Os estados no mapa são a situação fictícia gravada no cenário, sem alegação de telemetria em tempo real.
- Os horários e eventos históricos são sintéticos. A análise calcula suas métricas pela mesma consulta usada para histórico operacional.
- Os documentos cadastrais, telefones, CEP e domínio `.example` são marcadores fictícios. Não use dados pessoais reais.
- Não execute testes de integração, reset ou limpeza contra a conexão publicada.
