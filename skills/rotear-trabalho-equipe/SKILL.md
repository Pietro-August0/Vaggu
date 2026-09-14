---
name: rotear-trabalho-equipe
description: "Roteia tarefas da VAGGU para o integrante responsável e a branch Git correta. Use ao iniciar ou retomar trabalho, decidir autoria operacional, trocar de branch ou criar uma branch nova antes de editar, commitar ou abrir PR."
---

# Roteador de trabalho da equipe VAGGU

Escolha a pessoa e a branch que representam o trabalho real, preservando alterações locais e a autoria verdadeira de cada integrante.

## Contexto obrigatório

Leia `AGENTS.md`, `segunda-mente/Vaggu/Vaggu.md` e o pacote relevante do planejamento. Leia [references/equipe.md](references/equipe.md) para escolher o responsável e resolver tarefas que cruzam funções.

Quando a equipe declarar que um prompt ou uma entrega foi construído coletivamente, leia também [references/autoria-coletiva.md](references/autoria-coletiva.md). Nesse caso, mantenha um responsável técnico pela branch e registre como coautores somente os participantes confirmados.

Antes de trocar ou criar uma branch, confira:

- `git status --short` e o diff relevante;
- branch atual e commit-base;
- branches locais e remotas;
- objetivo, pacote ou issue da tarefa;
- arquivos já alterados e possíveis mudanças de outra pessoa.

Não faça `checkout`, `switch`, merge ou stash automático quando mudanças locais não pertencerem claramente à tarefa. Não descarte, esconda ou leve alterações para outra branch sem explicar o conflito e obter a decisão necessária.

## Escolher responsável

Classifique a entrega pela responsabilidade dominante, não apenas pela extensão dos arquivos. Use o mapa da equipe e indique um responsável primário. Para trabalho multidisciplinar, registre revisores ou coautores reais sem diluir a responsabilidade principal.

Nunca troque credenciais, sessão, `user.name` ou `user.email` para simular outro integrante. Nunca fabrique commits ou contribuições. O roteamento atribui o trabalho; cada pessoa autentica, revisa e assina suas próprias ações no GitHub.

## Registrar autoria coletiva

Uma única máquina não exige alternância de contas. Para trabalho coletivo confirmado:

1. mantenha explícita a identidade real que executará o commit;
2. selecione o responsável técnico e a branch pelo escopo da tarefa;
3. carregue os e-mails de commit de `ambiente.local/equipe-git.local.json`, que é ignorado pelo Git;
4. gere os trailers com `node skills/rotear-trabalho-equipe/scripts/gerar-coautoria.mjs --todos` ou informe apenas os usernames participantes;
5. revise a saída e acrescente os trailers ao fim da mensagem do commit.

Não adivinhe e-mails, não use um endereço que o integrante não tenha confirmado e não inclua quem apenas pertence ao time sem ter participado daquela entrega. Se faltar uma identidade confirmada, prepare o trabalho e pare antes do commit.

## Escolher ou criar branch

1. Se a tarefa continua uma issue ou entrega já aberta, reutilize a branch específica somente quando nome, diff e histórico confirmarem o mesmo escopo.
2. Se a branch atual já corresponde à tarefa e está segura, permaneça nela.
3. Se é trabalho novo, parta da `main` atualizada e crie uma branch curta no formato `<tipo>/<escopo>-<responsavel>`, por exemplo `feat/p05-importacao-samuel`, `fix/login-mobile-juan` ou `docs/segunda-mente-ana`.
4. Use `feat`, `fix`, `docs`, `test`, `refactor`, `chore` ou `perf` conforme o resultado esperado. Evite nomes vagos como `alteracoes`, `nova` ou `final`.
5. As branches `equipe/*` identificam as áreas permanentes dos integrantes. Não as reutilize para misturar tarefas independentes; prefira uma branch específica para cada acontecimento rastreável.

Ao criar uma branch a partir de trabalho local relacionado, confirme primeiro que todo o diff pertence ao mesmo escopo. Ao criar a partir do remoto, confirme que a árvore está limpa e que a base não está desatualizada.

## Executar e publicar

Depois do roteamento, anuncie de forma curta: responsável, branch, base e motivo. Faça as alterações autorizadas e valide conforme o projeto.

Commits, pushes, PRs, atribuições de issue e mudanças de proteção continuam sujeitos ao pedido atual e às permissões da sessão; esta skill não concede autorização externa por si só. Antes de publicar, confira diff, testes, segredos, arquivos acidentais e identidade Git ativa.

## Resultado obrigatório

Ao concluir, informe:

- responsável primário e revisores indicados;
- branch reutilizada ou criada e sua base;
- se a branch existe apenas localmente ou também no `origin`;
- commits, PR ou issue realmente criados;
- autoria individual ou coletiva registrada e identidades ainda pendentes;
- alterações locais preservadas e qualquer impedimento de autoria ou acesso.
