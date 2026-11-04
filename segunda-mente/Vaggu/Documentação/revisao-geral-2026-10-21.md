# Revisão geral — 21/10/2026

Revisamos a documentação vigente, a apresentação do repositório e os arquivos de apoio. Atualizamos o README com capturas da aplicação atual e preservamos os registros anteriores como histórico datado.

## Documentação e regras

- Reconciliamos os resumos com equipamentos/manutenção, consultas periódicas, filtros e métricas, snapshots históricos e telões web autorizados já implementados localmente.
- Mantivemos hardware físico e homologação publicada como pendentes; a conexão real do WhatsApp permanece adiada e Power BI publicado é opcional.
- Consolidamos o conteúdo útil de `CONTRIBUTING.md` no [AGENTS.md](../../../AGENTS.md) e removemos o arquivo redundante. Ajustamos os links ativos; menções históricas ao antigo arquivo permanecem contextualizadas.
- A regra agora exige prints das telas e estados afetados após toda alteração de design ou frontend, com desktop, tablet e celular quando responsivos, temas afetados, rota, perfil, viewport, origem dos dados e resultado no índice de evidências. O README também deve acompanhar mudanças na experiência exibida.
- Registramos a Sprint 7 em **04/11–11/11/2026** e a Sprint 8, última, em **16/11–26/11/2026**. As datas são previstas; não atribuímos tarefas nem inventamos sprints nos intervalos. Ver [Sprints do projeto](../Planejamento/Sprints%20do%20projeto.md).

## Limpeza com preservação das fontes

| Arquivo removido | Motivo |
| --- | --- |
| `vaggu-frontend/public/assets/mockup-laptop-vaggu-optimized.svg` | Intermediário sem consumo nas telas; a aplicação usa o WebP. |
| `vaggu-frontend/public/assets/phones-vaggu.png` | Duplicata da fonte documental; a versão publicada usa WebP sem perda. |
| `vaggu-frontend/public/assets/vaggu-foto-homem-login-sem-fundo.png` | PNG público redundante; WebP mantém dimensões, pixels e transparência. |
| `vaggu-frontend/public/assets/vaggu-circulado.png` | Variante PNG redundante; WebP preservado, sem consumo desse PNG. |
| `vaggu-frontend/scripts/optimize-images.py` | Utilitário antigo que, após a conversão dos PNGs públicos, apenas recriava a variante SVG sem uso. |

Os quatro assets removidos somavam **4.050.330 bytes**. Preservamos o SVG original válido do notebook, os WebP publicados, fontes de identidade, fotos de planejamento, evidências históricas e assets necessários para reproduzir os slides das personas. Não removemos migrations, testes, dados de apresentação, backup/restauração ou scripts operacionais ativos.

Encontramos PNG incorporado corrompido nos SVGs documentais `Identidade visual/Assets/mockup-laptop-vaggu.svg` e `Group 132.svg`. Substituímos somente o payload da imagem pela fonte válida do SVG público; conferimos a decodificação com Pillow e a igualdade da geometria SVG fora do payload. A corrupção não foi propagada às imagens publicadas.

## Ambiente de verificação

- Frontend compilado atual, API Express real e PostgreSQL 17 descartável, todos locais; origem `http://127.0.0.1:5183`.
- Shopping Exemplo, usuários e instalação de telão fictícios; nenhum cliente ou banco de produção foi alterado.
- Playwright com Edge headless. **Browser plugin not available**: o plugin Browser não está disponível nesta sessão, por isso usamos Playwright.
- Viewports: desktop 1440×1000, telão 1920×1080 e 1366×768, tablet 768×1024 e celular 390×844. Temas claro e escuro foram conferidos na análise.
- Autenticação pelo endpoint real, consultas reais ao banco e autorização própria do telão; não interceptamos nem substituímos as respostas da API.

## Verificações e evidências

| Verificação | Resultado |
| --- | --- |
| Backend | **130 testes aprovados, zero falhas e zero ignorados**, com migrations e bancos isolados; inclui dump/restauração e recusa de sobrescrita. |
| Regressão analítica | A expectativa do teste de telemetria passou a incluir andar/setor. O teste PostgreSQL também confere setores homônimos em andares distintos. |
| Frontend | Build e lint aprovados; o build mantém aviso de chunks acima de 500 kB. |
| Identidade da página e conteúdo | Rotas públicas, painel, análise, administração, editor e telão exibiram conteúdo da aplicação, sem tela vazia ou overlay de erro. |
| Console e largura | Nenhum erro JavaScript ou de console relevante; nenhuma captura apresentou overflow horizontal da página. Tabelas largas podem usar rolagem interna. |
| Login | Ajuda de recuperação abriu pelo botão; capturas do formulário sem senha preenchida. |
| Monitoramento | Acesso à aba e busca pela vaga N-03 com resposta visual. |
| Análise | Filtros de setor e categoria PCD enviados à API real; respostas 200 e atualização do recorte. |
| Estado sem observação | Período 01–03/08/2026 sem histórico exibiu a mensagem de ausência, sem interpretar como estacionamento vazio. |
| Exportações | Downloads PDF e Excel gerados com filtro de setor/PCD; PDF com 3 páginas e Excel com 10 abas. Ambos foram abertos por leitores e contêm Shopping Exemplo e PCD. |
| Telão | Autorização real, recortes agregados e evento offline ocultando contagens. |

A primeira captura do telão revelou categorias empilhadas que cortavam parte do conteúdo em 1920×1080. Corrigimos a marcação da página autorizada para reutilizar a grade, ícones e estrutura de categoria já existentes na prévia e ajustamos o espaçamento vertical. A conferência final confirmou que categorias e rodapé cabem em 1920×1080 e 1366×768, com novos prints após a correção. Também conferimos tablet e celular, com contagens ocultadas após o evento offline.

As **24 capturas atuais** e seus metadados estão no [índice de evidências](../Evidências%20visuais/Índice%20de%20evidências.md). A verificação documental passou com **350 arquivos cobertos e 53 documentos Markdown com links/âncoras válidos**, e `git diff --check` passou. Preservamos logs, resultados e exportações somente no ambiente local ignorado. Encerramos a API e o PostgreSQL de QA e removemos o cluster descartável, as credenciais e os scripts temporários criados nesta revisão; fontes, ferramentas e ambientes anteriores foram preservados.

## Limites e continuidade

Esta rodada cobre a execução local documentada, não homologação de produção, sensores físicos ou conexão real com a Meta. Não repetimos todas as operações administrativas de criação, edição e exclusão no navegador; os prints dessas áreas documentam sua renderização atual. O backup foi ensaiado tecnicamente, mas frequência, retenção e armazenamento externo de produção continuam como decisões operacionais pendentes.

Mantivemos as alterações locais na branch `feat/landing-fotos-favicon-juan`, em `16383524`, sem criar commit, push ou PR. Roteamento de responsabilidade: Ana para documentação, Juan para revisão visual e Elisa para UX/QA; essa indicação não atribui autoria Git nem aprovação a qualquer integrante.
