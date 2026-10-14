# Cenário fictício para apresentação

O comando `demo:create` cria **Shopping Aurora — DEMONSTRAÇÃO** em uma base escolhida explicitamente. O cenário contém cadastro institucional fictício completo, três gerentes com acessos individuais, dois pisos, quatro setores, 80 vagas posicionadas no mapa, quatro tipos de vaga e 15 dias de mudanças de estado para a análise e suas exportações. Os dados são identificados como fictícios na tela e nos relatórios. Não há sensores ou ESP32 reais nesse shopping.

## Aplicação no ambiente publicado pelo painel

Após a publicação do código e da migration, entre no site com uma conta administradora VAGGU e abra **Admin → Visão geral → Criar cenário fictício**. A ação protegida cria o shopping uma única vez e abre um diálogo com as três credenciais provisórias. Use **Baixar credenciais** antes de fechar: elas não são persistidas em texto claro e não aparecem novamente. Se o diálogo for fechado sem guardar as senhas, o administrador pode redefini-las na ficha de cada gerente.

## Aplicação alternativa com conexão direta

1. Confirme que a migration `20261014000100_cenario_demonstracao` foi aplicada pelo deploy do Render.
2. Em um computador autorizado a acessar o Neon, configure `DEMO_DATABASE_URL` com a conexão **do banco publicado** por um mecanismo local de segredo. O script ignora `DATABASE_URL` e nunca imprime a conexão.
3. Execute na pasta `vaggu-backend`:

   ```powershell
   npm run demo:create -- --apply --credentials-file=../ambiente.local/credenciais-aurora.local
   ```

   O arquivo de credenciais deve ainda não existir e terminar em `.local`. Ele é ignorado pelo Git e contém as três senhas provisórias geradas aleatoriamente. Guarde-o em local acessível apenas à equipe e entregue cada senha por canal privado. O primeiro login exige troca de senha.

4. Entre com cada gerente, confira o mapa, a análise dos últimos sete dias, o filtro de até 31 dias e as exportações Excel/PDF. A conta VAGGU existente pode conferir o shopping e os três gerentes na administração.

O script não modifica shoppings existentes. Uma nova execução encontra o identificador fixo do cenário e encerra sem alterar dados nem senhas. Caso seja necessário atualizar o histórico para uma apresentação futura, prepare uma rotina de atualização específica para os registros fictícios; não recrie nem apague o cenário manualmente em produção.

## Limites

- Os estados no mapa são a situação fictícia gravada no cenário, sem alegação de telemetria em tempo real.
- Os horários e eventos históricos são sintéticos. A análise calcula suas métricas pela mesma consulta usada para histórico operacional.
- Os documentos cadastrais, telefones, CEP e domínio `.example` são marcadores fictícios. Não use dados pessoais reais.
- Não execute testes de integração, reset ou limpeza contra a conexão publicada.
