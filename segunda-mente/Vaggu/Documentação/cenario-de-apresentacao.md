# Cenário fictício para apresentação

O **Shopping Exemplo** contém cadastro institucional fictício completo, três gerentes com acessos individuais, dois pisos, quatro setores, 80 vagas posicionadas no mapa, quatro tipos de vaga e 15 dias de mudanças de estado para a análise e suas exportações. Os dados são identificados como fictícios na tela e nos relatórios. Não há sensores ou ESP32 reais nesse shopping.

## Aplicação automática no ambiente publicado

Na inicialização com `NODE_ENV=production`, a API garante a existência do exemplo na mesma conexão `DATABASE_URL` usada pelo site. Assim, a publicação já configurada no Render cria o exemplo no Neon sem acesso manual ao banco nem botão adicional na interface. A criação é atômica; reinicializações preservam senhas e histórico, inclusive com duas instâncias iniciando juntas.

O shopping aparece na lista administrativa. Para entrar como gerente, use a redefinição de senha já existente na ficha de Marina Azevedo (`marina.azevedo@aurora-demo.example`), Rafael Nogueira ou Camila Duarte. As senhas iniciais são aleatórias, armazenadas somente como hash e descartadas após a criação automática; não aparecem nos logs. A senha provisória emitida pelo Admin exige troca no primeiro acesso. A visualização continua protegida por login.

A migration `20261015000100_nome_shopping_exemplo` renomeia somente o cenário conhecido que ainda se chama Shopping Aurora — DEMONSTRAÇÃO. Ela preserva seus acessos e dados. Shoppings personalizados não são renomeados.

## Aplicação alternativa com conexão direta

1. Confirme que a migration `20261014000100_cenario_demonstracao` foi aplicada pelo deploy do Render.
2. Em um computador autorizado a acessar o Neon, configure `DEMO_DATABASE_URL` com a conexão **do banco publicado** por um mecanismo local de segredo. O script ignora `DATABASE_URL` e nunca imprime a conexão.
3. Execute na pasta `vaggu-backend`:

   ```powershell
   npm run demo:create -- --apply --credentials-file=../ambiente.local/credenciais-exemplo.local
   ```

   O arquivo de credenciais deve ainda não existir e terminar em `.local`. Ele é ignorado pelo Git e contém as três senhas provisórias geradas aleatoriamente. Guarde-o em local acessível apenas à equipe e entregue cada senha por canal privado. O primeiro login exige troca de senha.

4. Entre com cada gerente, confira o mapa, a análise dos últimos sete dias, o filtro de até 31 dias e as exportações Excel/PDF. A conta VAGGU existente pode conferir o shopping e os três gerentes na administração.

O script não modifica shoppings existentes. Uma nova execução encontra o identificador fixo do cenário e encerra sem alterar dados nem senhas. Caso seja necessário atualizar o histórico para uma apresentação futura, prepare uma rotina de atualização específica para os registros fictícios; não recrie nem apague o cenário manualmente em produção.

## Verificação local

`npm run test:integracao` inclui o teste `cenario-apresentacao.test.ts`: ele cria o cenário em PostgreSQL descartável, confere estrutura, credenciais e análise e verifica que uma segunda execução não sobrescreve os acessos. Configure `.env.teste.local` com `TEST_DATABASE_URL` de um banco de controle dedicado; nunca use a conexão publicada. Sem essa configuração, `npm test` informa explicitamente que o cenário foi pulado.

## Limites do cenário

- Os estados no mapa são a situação fictícia gravada no cenário, sem alegação de telemetria em tempo real.
- Os horários e eventos históricos são sintéticos. A análise calcula suas métricas pela mesma consulta usada para histórico operacional.
- Os documentos cadastrais, telefones, CEP e domínio `.example` são marcadores fictícios. Não use dados pessoais reais.
- Não execute testes de integração, reset ou limpeza contra a conexão publicada.
