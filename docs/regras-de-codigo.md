# VAGGU — regras de código e organização

Versão 1.0 • 09/09/2026 • Aplicação: novas implementações e alterações no projeto.

## 1. Princípios

Código deve ser legível pela equipe, previsível, testável e proporcional ao TCC. Reutilizar o que já funciona. Uma estrutura organizada separa responsabilidades sem exigir uma grande quantidade de camadas vazias. A mudança deve resolver o problema solicitado e preservar comportamento não relacionado.

A stack definida é React, TypeScript, Tailwind, Node.js, Express, Prisma e PostgreSQL. Vite consta da base do projeto. Verificar versões e organização reais antes de alterar configurações. Não migrar para Next.js, outro ORM, outro banco, microserviços ou outra biblioteca visual por preferência do agente.

## 2. Português brasileiro

| Elemento | Convenção | Exemplo |
| --- | --- | --- |
| Interface | Português com acentos e linguagem clara | “Última atualização”, “Placa sem resposta” |
| Comentários e documentação | Português brasileiro, explicando finalidade e regra | “Exclui vagas indisponíveis do denominador.” |
| Variáveis e funções próprias | `camelCase`, português sem acentos | `vagasOcupadas`, `confirmarEstadoDaVaga` |
| Componentes e tipos | `PascalCase`, português sem acentos | `MapaDoEstacionamento`, `ResumoDeOcupacao` |
| Constantes próprias | `SCREAMING_SNAKE_CASE` | `TEMPO_SEM_RESPOSTA_MS` |
| Arquivos de domínio | `kebab-case` | `servico-de-ocupacao.ts`, `mapa-do-andar.tsx` |
| Pastas de domínio | Minúsculas, sem acentos | `autenticacao`, `equipamentos`, `relatorios` |
| Assets | Descrição específica, em `kebab-case` | `icone-vaga-eletrica.svg` |
| Testes | Descrever o comportamento em português | “impede acesso a vagas de outro shopping” |
| Commits/PRs | Descrição em português; prefixo técnico consistente | `fix(telemetria): impedir estado livre após expiração` |

Preservar APIs externas, palavras reservadas e arquivos obrigatórios de ferramenta. `useState`, `Request`, `Response`, `GET`, `package.json`, `tsconfig.json`, `schema.prisma`, `README.md` e `AGENTS.md` não precisam ser traduzidos. Abreviações comuns como API, ID, UUID e URL são aceitáveis. Evitar `data`, `obj`, `aux`, `managerData` e nomes genéricos quando existe um termo do domínio.

Manter a convenção local se renomear quebra contratos ou cria um diff desnecessário. Tradução estrutural deve ter escopo próprio, atualizar imports, testes, consumidores, migrations e documentação. Usar mapeamentos do ORM quando for útil preservar nomes físicos existentes.

Adotar “andar” na interface; “piso” em documentos antigos é o mesmo conceito. Não criar as duas entidades. Adotar “indisponível” na interface; `UNKNOWN`/“desconhecida” antigos representam essa mesma falta de observação confiável. Uma versão de API deve usar uma única convenção de enum.

## 3. Política de comentários explicativos

É obrigatório explicar cada parte relevante do sistema, de forma útil para manutenção e aprendizado:

1. **Arquivo/módulo:** comentário inicial de uma a três frases sobre a responsabilidade e a fronteira com outros módulos.
2. **Função de domínio/exportação:** documentar o que faz, restrições, retorno e efeitos relevantes. Usar JSDoc/TSDoc quando adequado.
3. **Componente/hook próprio:** explicar o papel, a origem dos dados e interações não evidentes.
4. **Blocos não triviais:** explicar o motivo da lógica, especialmente autorização, timers, confirmação, transações, concorrência, métricas e compatibilidade.
5. **Integrações/configuração:** explicar origem dos eventos, finalidade das variáveis e limitações. Nunca incluir valores secretos.
6. **Testes:** nomes em português e comentário quando o cenário exige uma sequência temporal difícil de entender.

Comentários devem acompanhar a alteração do código. Remover comentários que ficaram falsos. Não repetir cada atribuição, narrar imports ou explicar sintaxe óbvia. Arquivos gerados, lockfiles e bibliotecas de terceiros são exceções: documentar na origem ou no guia do módulo.

Exemplo ilustrativo, sem obrigar a criação deste arquivo:

```ts
/**
 * Reúne cálculos de ocupação compartilhados pelos resumos operacionais.
 * A camada de consulta deve fornecer contagens do mesmo shopping e recorte.
 */

/**
 * Calcula o percentual apenas sobre vagas com observação válida.
 * Retorna null quando não há dados conhecidos; zero significaria estacionamento vazio.
 */
export function calcularTaxaDeOcupacao(
  quantidadeOcupada: number,
  quantidadeLivre: number,
): number | null {
  const quantidadeConhecida = quantidadeOcupada + quantidadeLivre;

  // Vagas indisponíveis ficam fora da conta para não parecerem livres.
  if (quantidadeConhecida === 0) return null;

  return (quantidadeOcupada / quantidadeConhecida) * 100;
}
```

O exemplo pressupõe contagens inteiras não negativas já validadas na fronteira. No sistema, testes devem incluir denominador zero, ausência de dados e recortes diferentes.

## 4. Estrutura de pastas

Esta é uma **proposta para adaptação**, não uma ordem de mover todo o repositório. Se frontend e backend já estão em repositórios separados, aplicar os mesmos princípios em cada um.

| Caminho proposto | Responsabilidade |
| --- | --- |
| `AGENTS.md` | Regras de trabalho e referências. |
| `docs/` | Especificação, decisões, contratos, operação e identidade visual. |
| `frontend/src/aplicacao/` | Composição, rotas, provedores e inicialização. |
| `frontend/src/modulos/autenticacao/` | Login, sessão e troca de senha. |
| `frontend/src/modulos/estacionamento/` | Mapa, filtros, lista e detalhe de vaga. |
| `frontend/src/modulos/shoppings/` | Listagem e ficha administrativa. |
| `frontend/src/modulos/gerentes/` | Cadastro individual e situação de acesso. |
| `frontend/src/modulos/equipamentos/` | Placas, sensores, ocorrências e manutenção. |
| `frontend/src/modulos/analises/` | Histórico, comparações e exportações. |
| `frontend/src/modulos/teloes/` | Apresentação agregada em tela cheia. |
| `frontend/src/modulos/atendimentos/` | Demonstrações e suporte. |
| `frontend/src/componentes/` | Componentes reutilizados por mais de um domínio. |
| `frontend/src/estilos/` | Tokens semânticos, base global e estilos compartilhados. |
| `frontend/src/servicos/` | Cliente HTTP e adaptadores comuns de infraestrutura. |
| `frontend/src/assets/` | Assets importados pelo bundler, separados por finalidade. |
| `frontend/public/` | Arquivos que precisam de endereço estável, sem duplicar `src/assets`. |
| `backend/src/aplicacao/` | Express, rotas e composição das dependências. |
| `backend/src/modulos/` | Casos de uso e dados de cada domínio. |
| `backend/src/compartilhado/` | Erros, contexto autorizado e utilidades realmente comuns. |
| `backend/src/integracoes/` | WhatsApp e demais provedores externos. |
| `backend/src/tarefas/` | Expiração de comunicação e processamentos periódicos. |
| `backend/prisma/` | Schema, migrations e dados de desenvolvimento identificados. |
| `analises/power-bi/` | Documentação de medidas e artefatos analíticos conforme o fluxo da equipe. |
| `analises/sql/` | Views e consultas analíticas versionadas. |
| `hardware/` | Firmware e protocolo, se a equipe mantiver aqui o código das placas. |
| `testes/` | Cenários integrados/e2e quando não estiverem junto dos módulos. |

Dentro de um módulo backend, criar apenas arquivos necessários: `rotas.ts`, `validacao.ts`, `controlador.ts`, `servico.ts`, `repositorio.ts` e testes. Um controlador adapta HTTP; o serviço implementa regras; o repositório encapsula consultas. Não colocar Prisma em componentes React nem toda a regra de negócio na rota.

No frontend, co-localizar componentes e hooks usados somente pelo módulo. Promover para compartilhado quando houver reutilização real. Evitar uma pasta `utils` que acumula tudo e arquivos `index` que criem ciclos ou escondam dependências.

## 5. Assets e importações

- Nomear por conteúdo e finalidade, não pela ferramenta que exportou: `imagem-equipe-vaggu-atendimento.webp`, não `Frame-245.png`.
- Nomear variações relevantes: `logotipo-vaggu-claro.svg`, `logotipo-vaggu-escuro.svg`, `icone-vaga-pcd.svg`, `planta-estacionamento-andar-02.webp`.
- Manter o nome compatível com o conteúdo real; não chamar arquivo azul de amarelo.
- Registrar origem, autoria/licença aplicável, nó do Figma e locais de uso quando houver exportação.
- Usar assets reais fornecidos/exportados. Não redesenhar a logo nem improvisar vetores no lugar de um ícone disponível.
- Definir dimensões e proporções. Evitar imagem enorme para ícone pequeno e preservar a nitidez das plantas.
- Preferir importação estática para assets do código; documentos enviados por clientes ficam em armazenamento persistente com autorização.
- Verificar imports, CSS, HTML, caminhos dinâmicos e acesso externo antes de excluir um arquivo aparentemente sem uso.
- Após renomear, conferir diferença de maiúsculas/minúsculas em ambiente semelhante ao de produção.
- Não versionar tokens, URLs assinadas temporárias ou arquivos sensíveis de shoppings como assets públicos.

## 6. Frontend

- Componentes com responsabilidade clara e props tipadas. Evitar repetir cards, campos, tabelas, modais e feedbacks.
- Estado local para interação local; estado compartilhado apenas quando necessário. Não adicionar gerenciador global por hábito.
- Separar dados recebidos, filtros, estado de carregamento e estado do formulário.
- Tratar carregando, vazio, erro, atualização, sessão expirada e implantação em configuração.
- Limpar timers, conexões e inscrições ao desmontar. Evitar polling duplicado e chamadas causadas por dependências incorretas.
- Cancelar/ignorar a resposta de uma consulta antiga ao trocar de andar; não renderizar o andar anterior por corrida de rede.
- Receber `atualizadoEm`/validade e apresentar a atualidade dos dados. Uma falha de rede não autoriza manter estado “ao vivo”.
- Validação no cliente melhora a experiência; não substitui validação no servidor.
- Ações de salvar/importar/criar acesso precisam impedir duplo envio e preservar o formulário quando houver erro.
- Usar elementos semânticos, rótulos, foco e mensagens compreensíveis. Evitar `div` clicável sem interação equivalente por teclado.
- Não expor detalhes de infraestrutura, stack traces ou decisões internas nas telas do cliente.

## 7. API e segurança

- Autenticar, construir contexto de usuário/equipamento e autorizar a operação antes de acessar ou alterar os dados.
- Gerente: shopping vem da sessão validada, nunca apenas do corpo ou filtro do navegador.
- Verificar o dono do recurso em rotas por ID, downloads, exportações, eventos de tempo real e relatórios.
- Placa: credencial própria, rotacionável, limitada à placa e seus sensores. Segredos nunca em URL ou logs.
- Senhas humanas com hash de senha apropriado; não criptografia reversível. Hash/validação de credenciais de equipamento deve ser especificado separadamente, respeitando sua entropia e ameaça.
- Definir sessão e expiração conforme a arquitetura existente. Se cookies forem usados, configurar proteção adequada contra CSRF, `HttpOnly`, `Secure` e política `SameSite` compatível. Se tokens forem usados, não permitir que bloqueio espere indefinidamente pela expiração.
- Primeiro acesso: restringir recursos do painel até concluir a troca de senha no backend.
- Validar todos os payloads, parâmetros, filtros, limites de data, tamanho de upload e enumerações.
- Usar respostas consistentes; erro público em português e identificador de correlação quando existir. Não expor consultas, hash ou stack.
- Paginar listagens; parametrizar consultas SQL; não interpolar entrada do usuário em SQL.
- Evitar autorização baseada somente em CORS. CORS deve aceitar apenas origens necessárias, conforme implantação.
- Webhooks: validar origem/assinatura conforme documentação do provedor, deduplicar mensagens e não confundir evento de status com mensagem recebida.
- Arquivos privados não podem ficar acessíveis por um ID previsível; validar tipo/conteúdo, tamanho e escopo de download.

## 8. Banco, migrations e histórico

- PostgreSQL é a fonte persistente; Prisma organiza schema e migrations. Não usar memória do processo como única fonte de eventos confirmados.
- Identificadores estáveis. Imports conciliam por chave de domínio, sem recriar vagas existentes.
- Restrições: e-mail único; código de vaga único por shopping; sensor ativo não pode ocupar duas vagas e vaga não pode ter dois sensores ativos.
- Remover unicidade indevida de `shoppingId` no gerente para permitir vários logins no mesmo shopping.
- Validar vínculos cruzados em transações; usar constraints/índices quando suportados pela modelagem. Se uma regra exigir índice parcial SQL, documentá-lo na migration.
- Atualizar estado e inserir evento de transição na mesma transação.
- Concorrência precisa impedir dois processadores de confirmar o mesmo evento ou duas importações de sobrescreverem revisões sem controle.
- Preservar histórico em desativação. Não usar cascata destrutiva para apagar eventos junto com vaga/placa/andar.
- Guardar UTC e exibir no fuso cadastrado do shopping; para Cotia, usar `America/Sao_Paulo`, não deslocamento fixo embutido em todas as consultas.
- Mudanças de categoria, andar, setor e sensor precisam de vigência ou fotografia histórica para análises passadas.
- Validar a migration sobre dados de teste representativos e conferir preservação dos vínculos. Nunca usar reset de banco real como solução de migração.

## 9. Configuração e operação

Manter `.env.example` com nomes e descrições, sem segredos. Exemplos de configuração a conciliar com o código: conexão do banco, origem web, segredo de sessão, credenciais de integração, confirmação de estado, expiração e intervalo da rotina de verificação. Nomes impostos por ferramentas permanecem como exigidos; novas opções do domínio podem ser `CONFIRMACAO_OCUPACAO_MS` e `LIMITE_SEM_RESPOSTA_MS`.

Validar variáveis na inicialização. Não espalhar números mágicos. Explicar unidades no nome ou no contrato. Não enviar variáveis privadas ao bundle do frontend.

Frontend pode ficar na Vercel. A API e a rotina de expiração precisam de execução compatível com o mecanismo escolhido. Não depender de um `setInterval` em função efêmera para um serviço que exige continuidade. Confirmar capacidade real de conexões persistentes antes de adotar Socket.IO.

Logs devem permitir correlacionar evento, equipamento, shopping e falha sem registrar conteúdo sensível. Monitorar erros de ingestão, atrasos de expiração e falhas de atualização analítica. Documentar inicialização, recuperação e verificação dos serviços.

## 10. Git, revisão e comandos

- Usar o gerenciador indicado pelo lockfile; não criar lockfile concorrente.
- Conferir `git status` e `git diff` antes/depois; preservar mudanças não relacionadas.
- Não fazer formatação global junto de uma correção focalizada.
- Não inventar scripts. Documentar os comandos encontrados e seus resultados.
- Nomes de branch, quando fizerem parte da tarefa: `feat/mapa-por-andar`, `fix/expiracao-dos-sensores`, `docs/especificacao-vaggu`.
- Mensagem: `feat(gerentes): permitir logins individuais no mesmo shopping`.
- PR: problema, mudança de comportamento, validação, migrations e limitações relevantes.
- Não comitar artefatos de build, dependências, segredos, dumps reais ou resultados temporários.
- Para Power BI, revisar dados incluídos no PBIX antes de qualquer compartilhamento; ele pode conter dados importados. Seguir a forma de versionamento escolhida pela equipe, sem prometer diffs úteis para um binário.

## 11. Checklist rápido de revisão

- [ ] Nomes e comentários em português explicam cada módulo e regra não trivial.
- [ ] Mudança segue a arquitetura existente e não duplica componentes/regras.
- [ ] Permissão verificada no backend e recorte do shopping correto.
- [ ] Erros, concorrência, expiração e ausência de dados tratados.
- [ ] Histórico e IDs preservados; migration compatível.
- [ ] Assets descritivos, com referências atualizadas e origem conhecida.
- [ ] Interface validada e identidade preservada.
- [ ] Cenários relevantes executados, resultados e limitações documentados.
