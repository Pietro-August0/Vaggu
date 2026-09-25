# Mapa do projeto VAGGU

O frontend começa em main.tsx, monta o provedor de sessão e encaminha /login, /trocar-senha, /admin e /painel. O cliente HTTP chama /api/v1 pelo proxy local do Vite; o backend server.ts conecta os serviços e app.ts monta as rotas. Serviços validam permissões antes de acessar o Prisma/PostgreSQL. O cookie HttpOnly preserva a sessão no refresh; a identidade pública é restaurada da API.

Conhecimento, documentos e regras ficam em `segunda-mente`. As skills `start` e `end` usam o planejamento canônico da segunda mente como registro diário. Assets da aplicação ficam no `public` do frontend; o cofre mantém cópias próprias das evidências necessárias ao Obsidian. Dependências, builds, segredos e bancos ignorados não integram o mapa.

## Pastas principais

| Pasta | Finalidade |
| --- | --- |
| `scripts/` | Reúne verificações do repositório que não pertencem ao frontend nem ao backend. |
| `segunda-mente/` | Mantém o cofre Obsidian canônico, suas fontes, evidências e registros históricos. |
| `skills/` | Versiona rotinas operacionais usadas pelos agentes e pela equipe. |
| `vaggu-backend/` | Contém API, regras de domínio, persistência, integrações e testes do servidor. |
| `vaggu-frontend/` | Contém a aplicação React, componentes, páginas, contratos e assets publicados. |

As cópias de imagens entre `segunda-mente/Vaggu/Identidade visual/Assets/` e `vaggu-frontend/public/assets/` são intencionais: o cofre precisa renderizar a referência visual sem depender do bundle, enquanto a aplicação precisa publicar seus próprios arquivos. As notas em `segunda-mente/Vaggu/Skills/` são índices documentais, não implementações duplicadas.

### Documentos e evidências acrescentados em 23/09/2026

| Caminho | Responsabilidade |
| --- | --- |
| `segunda-mente/Vaggu/Documentação/fluxo-de-telas.md` | Registra rotas, jornadas por perfil, páginas planejadas e divergências atuais entre frontend, backend e evidências históricas. |
| `segunda-mente/Vaggu/Documentação/modelo-de-dados.md` | Explica o schema Prisma/PostgreSQL implementado, suas restrições e os limites que ainda precisam ser resolvidos no P06. |
| `segunda-mente/Vaggu/Planejamento/Sprints do projeto.md` | Preserva o relato confirmado das Sprints 1–2 e transcreve o planejamento fotografado das Sprints 3–4 sem confundi-las com P01–P11. |
| `segunda-mente/Vaggu/Planejamento/Plano de correção e implementação.md` | Ordena D01, C01 e P06, com responsáveis, dependências, riscos e critérios de aceite. |
| `segunda-mente/Vaggu/Evidências visuais/Planejamento/sprint-03-planejamento-09-09-2026.jpeg` | Cópia versionada da fotografia fornecida pela equipe com o planejamento da Sprint 3. |
| `segunda-mente/Vaggu/Evidências visuais/Planejamento/sprint-04-divisao-equipe.jpeg` | Cópia versionada da fotografia fornecida pela equipe com a divisão registrada para a Sprint 4. |
| `segunda-mente/Vaggu/Evidências visuais/Planejamento/guia-identidade-visual-vaggu.png` | Cópia versionada do guia visual fornecido pela equipe, usado como evidência para paleta e tipografia, sem atribuí-lo a uma extração do Figma. |
| `segunda-mente/Vaggu/Evidências visuais/landing-mobile-2026-09-24.png` | Captura da landing pública local em 390 px, feita em 24/09 após as animações; não comprova sessão ou deploy. |
| `segunda-mente/Vaggu/Evidências visuais/rodape-mobile-2026-09-24.png` | Captura do rodapé público local em 390 px, sem a imagem de celulares, feita em 24/09. |
| `segunda-mente/Vaggu/Evidências visuais/rodape-desktop-2026-09-24.png` | Captura do rodapé público local em 1440 px, com a imagem de celulares preservada, feita em 24/09. |
| `segunda-mente/Vaggu/Evidências visuais/login-mobile-2026-09-24.png` | Captura do login público local em 390 px, sem uso de credenciais, feita em 24/09. |

## Arquivos versionáveis

| Arquivo | Responsabilidade |
| --- | --- |
| `.gitattributes` | Padroniza tratamento de arquivos e terminações de linha no Git. |
| `.github/workflows/publicar-render.yml` | Solicita ao Render um novo deploy após cada push na `main`, usando um Deploy Hook guardado como segredo do GitHub. |
| `.gitignore` | Exclui ferramentas locais, segredos, dependências e saídas de build. |
| `AGENTS.md` | Define escopo, regras de implementação, documentação e verificação para agentes. |
| `README.md` | Apresenta a VAGGU no GitHub com proposta, experiência por perfil, imagens comentadas, tecnologias, início local e links para a documentação técnica. |
| `render.yaml` | Define build, inicialização, saúde e solicita os segredos de banco e Blob sem versionar seus valores. |
| `scripts/verificar-documentacao.mjs` | Confere se o mapa canônico explica os arquivos versionáveis e se os links internos da segunda mente possuem destino válido. |
| `skills/end/SKILL.md` | Documentação: Fechamento do dia — VAGGU. |
| `skills/end/agents/openai.yaml` | Metadados de descoberta e apresentação da skill no Codex. |
| `skills/rotear-trabalho-equipe/SKILL.md` | Roteia cada tarefa para o integrante responsável e seleciona ou cria uma branch segura e rastreável. |
| `skills/rotear-trabalho-equipe/agents/openai.yaml` | Metadados de descoberta e apresentação do roteador de trabalho da equipe. |
| `skills/rotear-trabalho-equipe/references/equipe.md` | Registra papéis, branches-base e critérios de desempate entre áreas da equipe. |
| `skills/rotear-trabalho-equipe/references/autoria-coletiva.md` | Define a atribuição honesta de coautoria para trabalho coletivo realizado em uma única máquina. |
| `skills/rotear-trabalho-equipe/scripts/gerar-coautoria.mjs` | Gera trailers `Co-authored-by` a partir da configuração local ignorada pelo Git, sem trocar identidades nem criar commits. |
| `skills/start/SKILL.md` | Documentação: Início do dia — VAGGU. |
| `skills/start/agents/openai.yaml` | Metadados de descoberta e apresentação da skill no Codex. |
| `vaggu-backend/.env.example` | Documenta banco, servidor, WhatsApp e token do Vercel Blob sem incluir credenciais reais. |
| `vaggu-backend/README.md` | Documentação: Vaggu Backend — 0.5.0. |
| `vaggu-backend/package-lock.json` | Fixa a árvore de dependências e integridade para instalação reproduzível via npm ci. |
| `vaggu-backend/package.json` | Declara dependências, faixa do Node e scripts de desenvolvimento, build e verificação. |
| `vaggu-backend/prisma.config.mjs` | Configura a CLI do Prisma: schema, migrations e conexão obtida do ambiente, sem credenciais no código. |
| `vaggu-backend/prisma/migrations/20260909000300_inicial_postgresql/migration.sql` | Cria o modelo PostgreSQL inicial de usuários, shoppings, sessões, placas, sensores, vagas e eventos do WhatsApp. |
| `vaggu-backend/prisma/migrations/20260912000100_estrutura_estacionamento/migration.sql` | Cria hierarquia, tipos, implantação, posições e relações compostas do P04. |
| `vaggu-backend/prisma/migrations/20260912000200_exclusao_reversivel_gerentes/migration.sql` | Acrescenta exclusão lógica de gerente, estado anterior e restrição de consistência para o desfazer. |
| `vaggu-backend/prisma/migrations/20260913000100_senha_provisoria_e_exclusao_shopping/migration.sql` | Acrescenta exclusão lógica de shopping e a cópia cifrada temporária da senha provisória. |
| `vaggu-backend/prisma/migrations/migration_lock.toml` | Registra o provedor PostgreSQL das migrations do Prisma. |
| `vaggu-backend/prisma/schema.prisma` | Define entidades, relações e restrições, incluindo estrutura, exclusão lógica, importação e URL da foto do shopping. |
| `vaggu-backend/scripts/create-admin.ts` | Comando interativo para criar o primeiro administrador e exibir a senha gerada uma única vez no terminal. |
| `vaggu-backend/src/app.ts` | Monta a API Express, restringe conexões externas do navegador ao ViaCEP pela política de segurança e, quando configurado, entrega o build React na mesma origem. |
| `vaggu-backend/src/auth/bootstrap.ts` | Cria o primeiro administrador por uma operação de terminal, sem cadastro público. |
| `vaggu-backend/src/auth/middleware.ts` | Autentica Bearer ou cookie HttpOnly, exige cabeçalho ant-CSRF nas escritas por cookie e fornece escopo às rotas. |
| `vaggu-backend/src/auth/password.ts` | Protege senhas com scrypt e sal aleatório; guarda o resultado derivado, nunca a senha original. |
| `vaggu-backend/src/auth/routes.ts` | Expõe login, identidade, troca de senha e logout; emite/remove cookie HttpOnly sem expor token ao cliente web. |
| `vaggu-backend/src/auth/service.ts` | Serviço de autenticação humana: valida credenciais, emite sessões opacas, retorna expiração ao middleware e recusa contas excluídas. |
| `vaggu-backend/src/config/database.ts` | Valida e normaliza a URL PostgreSQL usada pelo backend sem expor credenciais. |
| `vaggu-backend/src/config/env.ts` | Converte variáveis do processo em configuração da API e valida banco, porta e token opcional do Vercel Blob. |
| `vaggu-backend/src/estrutura/routes.ts` | Expõe configuração administrativa e consulta isolada da estrutura pelo gerente. |
| `vaggu-backend/src/estrutura/service.ts` | Valida hierarquia, tipos, posições e revisões concorrentes do mapa. |
| `vaggu-backend/src/importacao/contratos.ts` | Define a representação intermediária e os erros da prévia de importação reutilizáveis por CSV e XLSX. |
| `vaggu-backend/src/importacao/parser-csv.ts` | Converte CSV em uma prévia validada por linha e campo, sem persistir alterações. |
| `vaggu-backend/src/importacao/parser-tabela.ts` | Centraliza cabeçalhos, tipos, duplicatas e erros usados igualmente pelas prévias CSV e XLSX. |
| `vaggu-backend/src/importacao/parser-xlsx.ts` | Lê a primeira planilha XLSX com limites explícitos e a converte para o contrato tabular comum. |
| `vaggu-backend/src/importacao/routes.ts` | Expõe criação, consulta e confirmação administrativa de importações estruturais. |
| `vaggu-backend/src/importacao/service.ts` | Persiste prévias, confirma a estrutura de forma idempotente e restringe consultas ao shopping indicado. |
| `vaggu-backend/prisma/migrations/20260914000100_previas_importacao/migration.sql` | Cria armazenamento JSONB de prévias com vínculo ao shopping, índice e restrições de formato. |
| `vaggu-backend/prisma/migrations/20260914000200_dados_cadastrais_shopping/migration.sql` | Amplia a ficha do shopping com dados institucionais, endereço, horários e fuso, mantendo registros anteriores compatíveis. |
| `vaggu-backend/prisma/migrations/20260915000100_confirmacao_importacao/migration.sql` | Registra revisão e confirmação idempotente das prévias de importação estrutural. |
| `vaggu-backend/prisma/migrations/20260921000100_foto_shopping/migration.sql` | Registra a tentativa anterior de armazenar a foto em binário; é mantida no histórico e corrigida pela migration seguinte. |
| `vaggu-backend/prisma/migrations/20260921000200_referencia_foto_shopping/migration.sql` | Substitui a foto binária por URL externa e remove a cópia reversível da senha provisória. |
| `vaggu-backend/test/importacao-postgresql.test.ts` | Verifica persistência, isolamento de consulta e preservação de vagas e histórico em PostgreSQL descartável. |
| `vaggu-backend/src/conta/routes.ts` | Expõe consulta e edição da conta usando exclusivamente a identidade da sessão. |
| `vaggu-backend/src/conta/service.ts` | Atualiza somente dados pessoais permitidos, sem conceder mudanças de perfil ou shopping. |
| `vaggu-backend/src/lib/prisma.ts` | Cria o cliente Prisma compartilhado; serviços aceitam cliente transacional por injeção. |
| `vaggu-backend/src/server.ts` | Ponto de entrada executável: lê a configuração, conecta Prisma e armazenamento de fotos, informa o build do frontend e inicia o HTTP. |
| `vaggu-backend/src/shoppings/armazenamento-fotos.ts` | Adapta gravação e remoção das fotos públicas no Vercel Blob sem acoplar o domínio ao SDK. |
| `vaggu-backend/src/shoppings/routes.ts` | Rotas administrativas de cadastro, ficha, foto, gerentes, exclusões e emissão de senha provisória. |
| `vaggu-backend/src/shoppings/service.ts` | Valida a ficha e a imagem, envia foto ao Blob com erro seguro, administra shoppings e gerentes e entrega senha provisória somente na emissão. |
| `vaggu-backend/src/telemetria/confirmacao-estado.ts` | Calcula a confirmação temporal de leituras de vaga já validadas, sem receber telemetria ou persistir dados. |
| `vaggu-backend/src/whatsapp/client.ts` | Cliente de envio de texto pela API da Meta; recebe configuração privada e transporte substituível em testes. |
| `vaggu-backend/src/whatsapp/payload.ts` | Interpreta o formato externo do webhook e mantém os textos do menu demonstrativo. |
| `vaggu-backend/src/whatsapp/routes.ts` | Recebe o desafio de configuração e os eventos da Meta, validando sua origem antes de processá-los. |
| `vaggu-backend/src/whatsapp/service.ts` | Coordena mensagens recebidas, deduplicação persistente e respostas do menu demonstrativo. |
| `vaggu-backend/src/whatsapp/signature.ts` | Calcula e verifica assinaturas HMAC para confirmar que o corpo recebido veio de quem possui o segredo Meta. |
| `vaggu-backend/test-support/admin-cases.ts` | Verifica acessos administrativos, foto externa, credencial não reversível, bloqueio, exclusão, prazo para desfazer e reutilização segura do e-mail. |
| `vaggu-backend/test-support/auth-cases.ts` | Cenários sequenciais de autenticação e isolamento, usados pelo runner com banco exclusivo. |
| `vaggu-backend/test/auth-cookie.test.ts` | Verifica cookie HttpOnly, restauração da identidade, proteção ant-CSRF e limpeza no logout sem banco real. |
| `vaggu-backend/test-support/banco-de-teste.ts` | Prepara um banco PostgreSQL exclusivo por execução e aplica as migrations versionadas. |
| `vaggu-backend/test-support/estrutura-cases.ts` | Verifica hierarquia, mapa, implantação e isolamento do P04 em PostgreSQL real. |
| `vaggu-backend/test/app.test.ts` | Verifica montagem da API, saúde, prontidão, política de conexões do navegador e respostas para rotas inexistentes. |
| `vaggu-backend/test/env.test.ts` | Verifica leitura e rejeição das variáveis de ambiente obrigatórias. |
| `vaggu-backend/test/integracao-acessos.test.ts` | Executa os cenários HTTP de autenticação e administração em PostgreSQL descartável. |
| `vaggu-backend/test/importacao-csv.test.ts` | Verifica a prévia CSV do P05, incluindo normalização, duplicatas, colunas ausentes e sintaxe inválida. |
| `vaggu-backend/test/confirmacao-estado.test.ts` | Verifica janela, continuidade, alternância e leituras repetidas na confirmação temporal do P06. |
| `vaggu-backend/test/importacao-routes.test.ts` | Verifica autorização e transporte HTTP da prévia CSV administrativa. |
| `vaggu-backend/test/prisma-postgresql.test.ts` | Confere provider, relações, índices e migrations PostgreSQL, inclusive URL da foto e remoção dos campos binário/reversível. |
| `vaggu-backend/test/whatsapp.test.ts` | Verifica assinatura, desafio, interpretação, deduplicação e respostas do webhook WhatsApp. |
| `vaggu-backend/tsconfig.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/components.json` | Configura aliases e estilo de geração dos componentes shadcn. |
| `vaggu-frontend/eslint.config.js` | Configura o ESLint para TypeScript, React Hooks e recarga do Vite. |
| `vaggu-frontend/index.html` | Documento de entrada do Vite e ponto de montagem do React. |
| `vaggu-frontend/package-lock.json` | Fixa a árvore de dependências e integridade para instalação reproduzível via npm ci. |
| `vaggu-frontend/package.json` | Declara dependências, faixa do Node e scripts de desenvolvimento, build e verificação. |
| `vaggu-frontend/public/assets/city-flow-vaggu.png` | Asset visual city-flow-vaggu.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/hero-vaggu.png` | Asset visual hero-vaggu.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/mockup-laptop-vaggu.svg` | Asset visual mockup-laptop-vaggu.svg; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/phones-vaggu.png` | Imagem de celulares usada apenas na composição do rodapé desktop da landing; no mobile, o rodapé prioriza conteúdo e links. |
| `vaggu-frontend/public/assets/vaggu-circulado.png` | Variante circular da marca preservada no catálogo público; não está montada nas telas atuais. |
| `vaggu-frontend/public/assets/vaggu-foto-homem-login-sem-fundo.png` | Asset visual vaggu-foto-homem-login-sem-fundo.png; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/public/assets/vaggu-logo-white.svg` | Variante vetorial branca da marca, sem filtro de sombra, usada na landing e em outras superfícies escuras. |
| `vaggu-frontend/public/assets/vaggu-logo-yellow.svg` | Variante amarela do logotipo preservada no catálogo público; não está montada nas telas atuais. |
| `vaggu-frontend/public/assets/vaggu-logo.svg` | Asset visual vaggu-logo.svg; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/src/app/app-store.tsx` | Restaura identidade via cookie e `/auth/me` antes de liberar rotas; gerencia expiração, logout, troca de senha e consultas. |
| `vaggu-frontend/src/components/brand.tsx` | Reutiliza os arquivos de marca publicados em public/assets nos links para a página inicial. |
| `vaggu-frontend/src/components/dashboard-shell.tsx` | Compartilha cabeçalho, menu responsivo com seções contextuais, alternância claro/escuro e saída da sessão entre os painéis autenticados. |
| `vaggu-frontend/src/components/estrutura-admin.tsx` | Permite criar a hierarquia, explica o estado real de implantação e alterna cadastro, mapa e posições com refetch após mutações. |
| `vaggu-frontend/src/components/exportacao-estrutura.tsx` | Abre a janela de exportação estrutural, mostra o recorte e inicia o download XLSX sob demanda. |
| `vaggu-frontend/src/components/importacao-estrutura.tsx` | Permite ao Admin baixar o modelo CSV, enviar CSV/XLSX, revisar registros e erros, confirmar a importação e consultar o resumo aplicado. |
| `vaggu-frontend/src/components/formulario-shopping.tsx` | Compartilha cadastro e edição em três etapas; consulta CEP, mantém edição manual e oferece preview, troca ou remoção da foto. |
| `vaggu-frontend/src/components/foto-shopping.tsx` | Renderiza a foto HTTPS ou o fallback com ícone escuro no tema claro e claro no tema escuro. |
| `vaggu-frontend/src/components/mapa-estacionamento.tsx` | Busca a estrutura isolada do gerente, mostra aviso de implantação sem ocultá-la e delega o desenho ao componente compartilhado. |
| `vaggu-frontend/src/components/visualizacao-vagas.tsx` | Compartilha mapa 2D, filtros e estados; listas de vagas usam grid fluido no celular e quando faltam posições. |
| `vaggu-frontend/src/components/icone-whatsapp.tsx` | Disponibiliza o símbolo usado nos links de atendimento, sem requisições externas. |
| `vaggu-frontend/src/components/operacao-vaggu.css` | Foto e conteúdo dividem a seção sem impor uma altura vazia acima dos benefícios. |
| `vaggu-frontend/src/components/operacao-vaggu.tsx` | Relaciona a imagem de movimento urbano aos benefícios da gestão e ao atendimento. |
| `vaggu-frontend/src/components/protected-route.tsx` | Aguarda a restauração da sessão antes de proteger a navegação; autorização de recursos continua no backend. |
| `vaggu-frontend/src/components/sobre-vaggu.css` | Escala, anéis automáticos e pesos da landing; medidas compartilhadas mantêm as conexões alinhadas. |
| `vaggu-frontend/src/components/sobre-vaggu.tsx` | Apresenta a solução, a jornada comercial e os benefícios; inicia as conexões quando o painel está quase todo visível. |
| `vaggu-frontend/src/components/ui/alert.tsx` | Componente de interface reutilizável alert; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/avatar.tsx` | Componente de interface reutilizável avatar; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/badge.tsx` | Componente de interface reutilizável badge; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/button.tsx` | Componente de interface reutilizável button; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/card.tsx` | Componente de interface reutilizável card; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/dialog.tsx` | Componente de interface reutilizável dialog; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/field.tsx` | Componente de interface reutilizável field; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/input.tsx` | Componente de interface reutilizável input; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/label.tsx` | Componente de interface reutilizável label; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/separator.tsx` | Componente de interface reutilizável separator; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/sheet.tsx` | Componente de interface reutilizável sheet; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/sonner.tsx` | Componente de interface reutilizável sonner; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/table.tsx` | Componente de interface reutilizável table; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/components/ui/tooltip.tsx` | Componente de interface reutilizável tooltip; usado para controles, estados e composição acessível. |
| `vaggu-frontend/src/hooks/use-scroll-reveal.ts` | Revela uma vez os blocos da landing conforme entram na viewport; a decisão atual mantém esse movimento automático. |
| `vaggu-frontend/src/index.css` | Reúne temas claro/escuro, compatibilidade visual dos painéis, responsividade e microinterações dos cards acionáveis. |
| `vaggu-frontend/src/lib/constants.ts` | Publica links de contato somente após configurar o número oficial da equipe. |
| `vaggu-frontend/src/lib/utils.ts` | Combina classes condicionais e resolve conflitos de utilitários Tailwind. |
| `vaggu-frontend/src/main.tsx` | Inicializa o React e reúne tema, mensagens, sessão e rotas separadas da estrutura, gerentes e conta. |
| `vaggu-frontend/src/pages/admin-page.tsx` | Implementa cadastro, lista e ficha do shopping; a visão geral resume contatos e contagens compactas por estado/categoria, enquanto estrutura/mapa e gerentes mantêm importação/exportação, senha provisória e exclusões administrativas. |
| `vaggu-frontend/src/pages/area-autenticada.tsx` | Separa mapa operacional e Minha conta do gerente em rotas próprias; o Admin usa a página administrativa dedicada. |
| `vaggu-frontend/src/pages/landing-page.tsx` | Compõe a landing pública; mantém o card claro de contato legível em ambos os temas, e o rodapé móvel usa chamada e navegação sem duplicar a imagem de celulares. |
| `vaggu-frontend/src/pages/login-page.css` | Define composição responsiva do login, troca de senha e desenho animado do rabisco em “vagas”. |
| `vaggu-frontend/src/pages/login-page.tsx` | Entrada única para Admin e gerente, sem solicitar preenchimento automático das credenciais ao abrir a página. |
| `vaggu-frontend/src/pages/pagina-nao-encontrada.tsx` | Exibe a rota 404 pública, oferece retorno à landing e compõe a animação semântica da vaga liberada. |
| `vaggu-frontend/src/pages/pagina-nao-encontrada.css` | Define o layout responsivo e a sequência única em que o carro deixa o sensor vermelho, sai pela esquerda e libera o estado verde. |
| `vaggu-frontend/src/pages/trocar-senha-page.tsx` | Exige uma senha definitiva e reaproveita na aba a senha provisória digitada no login. |
| `vaggu-frontend/src/servicos/api.ts` | Cliente da API na mesma origem para JSON e corpos binários; envia cookie e cabeçalho ant-CSRF sem ler o token. |
| `vaggu-frontend/src/servicos/cep.ts` | Consulta o ViaCEP com validação, prazo e erros distintos; devolve somente campos de endereço usados no formulário. |
| `vaggu-frontend/src/servicos/situacao-implantacao.ts` | Centraliza rótulos, descrições e cores dos estados de implantação já definidos no backend. |
| `vaggu-frontend/src/servicos/estrutura.ts` | Valida a árvore pública de andares, setores, vagas e posições recebida da API. |
| `vaggu-frontend/src/servicos/exportacao-estrutura.ts` | Gera no navegador um XLSX estilizado com vagas e resumo da estrutura já carregada, sem endpoint novo nem dados históricos. |
| `vaggu-frontend/src/servicos/importacao.ts` | Valida as respostas da API de prévia e confirmação antes de entregá-las à interface administrativa. |
| `vaggu-frontend/src/servicos/shoppings.ts` | Valida fichas, listas, URL HTTPS de imagem e gerentes recebidos pelas rotas administrativas. |
| `vaggu-frontend/src/types/app.ts` | Declara o contrato da identidade autenticada compartilhado pela interface. |
| `vaggu-frontend/src/types/estrutura.ts` | Declara os contratos TypeScript da estrutura, implantação, tipos e mapa. |
| `vaggu-frontend/src/types/admin.ts` | Declara os contratos TypeScript da ficha administrativa, incluindo referência da foto, e dos gerentes. |
| `vaggu-frontend/src/types/importacao.ts` | Declara prévias, erros, registros e resumos da importação estrutural. |
| `vaggu-frontend/src/vite-env.d.ts` | Disponibiliza ao TypeScript os tipos de ambiente fornecidos pelo Vite. |
| `vaggu-frontend/tsconfig.app.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/tsconfig.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/tsconfig.node.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/vite.config.ts` | Configura React, Tailwind, aliases e proxy local de /api para o backend. |
