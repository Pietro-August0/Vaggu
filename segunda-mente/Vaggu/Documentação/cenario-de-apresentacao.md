# Cenário fictício para apresentação

O **Shopping Exemplo** contém cadastro institucional fictício completo, três gerentes com acessos individuais, dois pisos, quatro setores, 80 vagas posicionadas no mapa, quatro tipos de vaga e 15 dias de mudanças de estado para a análise e suas exportações. Também possui quatro placas e 80 sensores de apresentação, com situações e horários persistidos. Não há sensores ou ESP32 reais nesse shopping. Por decisão de 15/10, os avisos de origem fictícia foram retirados das telas e dos relatórios; a marcação técnica interna foi preservada.

O funcionamento e os testes do editor e dos sensores estão em [edição visual e monitoramento](edicao-visual-e-monitoramento.md).

## Formato da apresentação — definido em 17/10/2026

- **Slides:** serão criados por nós.
- **Data prevista:** início de dezembro de 2026; dia e horário exatos ainda não confirmados.
- **Duração de referência:** normalmente 20 a 25 minutos, conforme registro interno; confirmar o limite final com a organização.
- **WhatsApp:** demonstrar uma interação real entre cliente e robô, com recebimento e respostas funcionando no nosso número. Já compramos um chip e dispomos de um celular para configurar o serviço. Isso registra recursos disponíveis, sem comprovar ativação do número, configuração Meta ou homologação do bot.
- **Telões:** apresentação breve, podendo usar uma interação ou fotos do formato. A escolha do formato ainda está aberta; fotos demonstram o layout, sem comprovar atualização operacional ao vivo. Esta escolha para a apresentação não encerra o pacote funcional de telões.
- **Power BI:** consideramos suficiente uma imagem com os modelos de gráficos nos slides. Não é necessária demonstração ao vivo de recebimento de dados, atualização do relatório ou integração com o site para esta apresentação. A imagem ilustra a proposta visual e não comprova uma integração funcional. Esta decisão reduz a exigência da apresentação; não encerra P09 nem altera automaticamente o escopo do produto.
- **Site:** ficará aberto durante a apresentação, com uma navegação breve para demonstrar seu uso. Telas, sequência e responsável pela navegação ainda precisam ser escolhidos.
- **Protótipo físico:** sensores ficarão instalados na maquete. Um deles ficará dentro de uma caixa/carcaça de proteção que criaremos, para demonstrar o formato de acondicionamento do sensor. Material, dimensões, fixação e modelo do sensor ainda não foram informados.
- **Integração física:** a presença dos sensores na maquete não comprova, por si só, atualização das vagas no site. Esse fluxo precisa de teste próprio. O Shopping Exemplo descrito neste documento continua sendo sintético; não foi confirmado como destino da telemetria da maquete.

### Informações dos sensores — responsável e retomada

Em 17/10/2026, registramos que as definições dos sensores estão sob responsabilidade de **Kamilly**, com detalhamento posterior. Aguardar modelo do sensor/hardware, frequência das leituras, tempos de confirmação e perda de comunicação e procedimento de manutenção. Detalhes da carcaça também permanecem pendentes. Não adotar valores provisórios do código como decisões finais do projeto.

### Preparação necessária do WhatsApp

Configurar o número e o ambiente Meta, concluir os fluxos escolhidos e ensaiar a conversa real antes da apresentação. O roteiro deve indicar a mensagem inicial, as respostas/opções do cliente, as respostas esperadas do robô e o encerramento ou encaminhamento humano, quando fizer parte do fluxo. As opções e os textos finais ainda precisam de definição interna.

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
