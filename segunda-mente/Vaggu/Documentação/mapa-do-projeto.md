# Mapa do projeto VAGGU

**Atualização de 21/10/2026:** `Especificações/Personas.md` reúne Carlos, Mariana e Rafael, separando material recebido de hipóteses. `Evidências visuais/Personas/` guarda duas páginas originais de Carlos, dois retratos gerados e quatro slides ilustrativos de Mariana e Rafael; `scripts/gerar-slides-personas.py` reproduz a diagramação desses quatro slides. A análise histórica distingue setores pelo andar e nome e deixa cobertura indisponível sem capacidade atual de referência.

O frontend começa em main.tsx, monta o provedor de sessão e encaminha /login, /trocar-senha, /admin e /painel. O cliente HTTP chama /api/v1 pelo proxy local do Vite; o backend server.ts conecta os serviços e app.ts monta as rotas. Serviços validam permissões antes de acessar o Prisma/PostgreSQL. O cookie HttpOnly preserva a sessão no refresh; a identidade pública é restaurada da API.

Conhecimento, documentos e regras ficam em `segunda-mente`. O planejamento canônico registra a situação atual e a continuidade. Imagens da aplicação ficam no `public` do frontend; o cofre mantém cópias próprias das evidências necessárias ao Obsidian. Dependências, builds, segredos e bancos ignorados não integram o mapa.

**Revisão geral de 21/10/2026:** `AGENTS.md` consolida os acordos antes mantidos em `CONTRIBUTING.md` e exige prints após alterações de design/frontend. O README usa capturas da aplicação atual com dados fictícios. `Evidências visuais/2026-10-21 - Revisao geral/` reúne telas públicas, painéis, filtros, estados vazios, editor e telão; `Documentação/revisao-geral-2026-10-21.md` registra verificação, limites e limpeza. Removemos quatro assets públicos redundantes e o otimizador antigo sem função atual, preservando fontes e WebP usados. Reparados os rasters incorporados dos dois SVGs documentais, sem alterar a geometria.

## Pastas principais

| Arquivo do piloto HTTPS | Responsabilidade |
| --- | --- |
| `hardware/esp32-3-vagas/vaggu_3_vagas/transporte.h` | Seleciona HTTPS com bundle oficial e relógio NTP; HTTP somente quando explicitamente habilitado para IPv4 privado de bancada. |
| `vaggu-backend/src/telemetria/piloto.ts` | Cria transacionalmente shopping, três vagas e sensores, placa e gerente próprios de piloto, sem redefinir cadastros existentes. |
| `vaggu-backend/scripts/preparar-piloto-esp32.ts` | Provisiona destino PostgreSQL explicitamente selecionado e grava configuração HTTPS/acesso somente em pasta local ignorada. |
| `vaggu-backend/test/piloto-esp32-postgresql.test.ts` | Verifica isolamento, hashes, vínculo das três vagas, estado inicial e recusa de repetição em banco descartável. |

| Arquivo da integração física | Responsabilidade |
| --- | --- |
| `vaggu-backend/scripts/preparar-bancada-esp32.ts` | Prepara shopping local de três vagas, sensores, placa e gerente; preserva execuções anteriores e grava credenciais somente em arquivos locais ignorados. |

| Arquivo de hardware | Responsabilidade |
| --- | --- |
| `hardware/esp32-3-vagas/README.md` | Parecer de viabilidade do demo, diagramas de ligação/arquitetura/posição, preparação da API, provisionamento, calibração e aceite físico. |
| `hardware/esp32-3-vagas/teste_sensores_usb/teste_sensores_usb.ino` | Ensaio independente USB/Serial, sem rede, com TRIG 27/26/25, ECHO 32/33/34 e LED GPIO13 controlado pelo S01 até 15 cm; três piscadas iniciais e diagnóstico serial. |
| `hardware/esp32-3-vagas/vaggu_3_vagas/vaggu_3_vagas.ino` | Firmware de bancada WROOM-32 para três HC-SR04, ECHO 32/33/34, LEDs de detecção local 13/14/23, autenticação Device, sequência por boot e leituras filtradas com omissão de sensores sem leitura válida. |
| `hardware/esp32-3-vagas/vaggu_3_vagas/config.example.h` | Modelo sem segredos para gerar config.h local ignorado pelo Git. |

| Pasta | Finalidade |
| --- | --- |
| `scripts/` | Reúne verificações do repositório que não pertencem ao frontend nem ao backend. |
| `segunda-mente/` | Mantém o cofre Obsidian canônico, suas fontes, evidências e registros históricos. |
| `vaggu-backend/` | Contém API, regras de domínio, persistência, integrações e testes do servidor. |
| `vaggu-frontend/` | Contém a aplicação React, componentes, páginas, contratos e assets publicados. |

As cópias de imagens entre `segunda-mente/Vaggu/Identidade visual/Assets/` e `vaggu-frontend/public/assets/` são intencionais: o cofre precisa mostrar a referência visual sem depender do arquivo gerado do site, enquanto a aplicação precisa publicar seus próprios arquivos.

### Documentos e evidências acrescentados em 23/09/2026

| Caminho | Responsabilidade |
| --- | --- |
| `segunda-mente/Vaggu/Documentação/fluxo-de-telas.md` | Registra rotas, jornadas por perfil, páginas planejadas e divergências atuais entre frontend, backend e evidências históricas. |
| `segunda-mente/Vaggu/Documentação/modelo-de-dados.md` | Explica o schema Prisma/PostgreSQL implementado, suas restrições e os limites que ainda precisam ser resolvidos no P06. |
| `segunda-mente/Vaggu/Documentação/cenario-de-apresentacao.md` | Explica a aplicação controlada do shopping fictício no ambiente escolhido e a entrega privada das três senhas. |
| `segunda-mente/Vaggu/Planejamento/Sprints do projeto.md` | Registra as datas das Sprints 3–6 nas fotografias, as Sprints 1–2 sem dias exatos e o calendário previsto das Sprints 7–8, sendo a 8 a última; preserva a duração variável e separa sprints de P01–P11. |
| `segunda-mente/Vaggu/Planejamento/Plano de correção e implementação.md` | Ordena D01, C01 e P06, com responsáveis, dependências, riscos e critérios de aceite. |
| `segunda-mente/Vaggu/Evidências visuais/Planejamento/sprint-03-planejamento-09-09-2026.jpeg` | Cópia versionada da fotografia de referência do projeto com o planejamento da Sprint 3. |
| `segunda-mente/Vaggu/Evidências visuais/Planejamento/sprint-04-divisao-equipe.jpeg` | Cópia versionada da fotografia de referência do projeto com a divisão registrada para a Sprint 4. |
| `segunda-mente/Vaggu/Evidências visuais/Planejamento/guia-identidade-visual-vaggu.png` | Cópia versionada do guia visual de referência do projeto, usado como evidência para paleta e tipografia, sem atribuí-lo a uma extração do Figma. |
| `segunda-mente/Vaggu/Evidências visuais/landing-mobile-2026-09-24.png` | Captura da landing pública local em 390 px, feita em 24/09 após as animações; não comprova sessão ou deploy. |
| `segunda-mente/Vaggu/Evidências visuais/rodape-mobile-2026-09-24.png` | Captura do rodapé público local em 390 px, sem a imagem de celulares, feita em 24/09. |
| `segunda-mente/Vaggu/Evidências visuais/rodape-desktop-2026-09-24.png` | Captura do rodapé público local em 1440 px, com a imagem de celulares preservada, feita em 24/09. |
| `segunda-mente/Vaggu/Evidências visuais/login-mobile-2026-09-24.png` | Captura do login público local em 390 px, sem uso de credenciais, feita em 24/09. |

## Personas e otimização de imagens — atualização de 16/10/2026

| Arquivo | Responsabilidade |
| --- | --- |
| `vaggu-frontend/public/assets/estacionamento-aereo-vaggu.webp` | Imagem ilustrativa criada a partir da referência visual do projeto em 19/10/2026; usada na seção de operação com carregamento adiado. |
| `vaggu-frontend/public/assets/estacionamento-hero-vaggu.webp` | Imagem ilustrativa criada a partir da referência visual do projeto em 19/10/2026; exibida na abertura da landing. |
| `vaggu-frontend/public/assets/favicon-vaggu.svg` | Favicon vetorial baseado no ícone de referência do projeto, com o “v” da marca oficial. |
| `vaggu-frontend/public/assets/mockup-laptop-vaggu.webp` | Imagem WebP do notebook exibida na seção sobre a VAGGU, com carregamento adiado. |
| `vaggu-frontend/public/assets/phones-vaggu.webp` | Versão WebP sem perda dos celulares do rodapé desktop da landing; composição oculta no mobile. |
| `vaggu-frontend/public/assets/vaggu-circulado.webp` | Versão WebP sem perda da variante circular da marca; preservada no catálogo, sem uso nas telas atuais. |
| `vaggu-frontend/public/assets/vaggu-foto-homem-login-sem-fundo.webp` | Versão WebP sem perda do retrato decorativo recortado usado no login, preservando transparência. |
| `segunda-mente/Vaggu/Especificações/Personas.md` | Registra Carlos a partir dos slides originais do projeto, complementos e personas propostas, fontes, necessidades, hipóteses de validação e limites de escopo e permissões. |

## Arquivos versionáveis

| Arquivo | Responsabilidade |
| --- | --- |
| `.gitattributes` | Padroniza tratamento de arquivos e terminações de linha no Git. |
| `.github/workflows/publicar-render.yml` | Solicita ao Render um novo deploy após cada push na `main`, usando um Deploy Hook guardado como segredo do GitHub. |
| `.gitignore` | Exclui ferramentas locais, segredos, dependências e saídas de build. |
| `AGENTS.md` | Reúne nossos acordos de desenvolvimento, isolamento, documentação, autoria e prints obrigatórios após alterações de design ou frontend. |
| `README.md` | Apresenta a VAGGU no GitHub com proposta, experiência por perfil, imagens comentadas, tecnologias, início local e links para a documentação técnica. |
| `render.yaml` | Define build, inicialização, saúde e solicita os segredos de banco e Blob sem versionar seus valores. |
| `scripts/verificar-documentacao.mjs` | Confere cobertura do mapa, wikilinks e destinos/âncoras locais de todos os Markdown versionáveis, incluindo READMEs; ignora exemplos em blocos de código. |
| `scripts/gerar-slides-personas.py` | Gera os quatro slides PNG ilustrativos de Mariana e Rafael, reutilizando retratos locais e a identidade preta e amarela da referência. |
| `segunda-mente/Vaggu/Evidências visuais/Personas/README.md` | Registra fontes e prompts dos recortes e fundos, reprodução com Poppins e conferência dos slides de Mariana e Rafael com os originais de Carlos. |
| `segunda-mente/Vaggu/Documentação/auditoria-documental-2026-10-15.md` | Consolida a auditoria semântica, as pendências funcionais e de aceite, as evidências e os limites da revisão de 15/10. |
| `vaggu-backend/.env.example` | Documenta banco, servidor, WhatsApp e parâmetros provisórios da telemetria sem incluir credenciais reais. |
| `vaggu-backend/README.md` | Documentação: Vaggu Backend — 0.5.0. |
| `vaggu-backend/package-lock.json` | Fixa a árvore de dependências e integridade para instalação reproduzível via npm ci. |
| `vaggu-backend/package.json` | Declara dependências, faixa do Node e scripts de desenvolvimento, build, verificação, provisionamento e simulação de telemetria. |
| `vaggu-backend/prisma.config.mjs` | Configura a CLI do Prisma: schema, migrations e conexão obtida do ambiente, sem credenciais no código. |
| `vaggu-backend/prisma/migrations/20260909000300_inicial_postgresql/migration.sql` | Cria o modelo PostgreSQL inicial de usuários, shoppings, sessões, dispositivos, vagas, histórico legado e eventos do WhatsApp. |
| `vaggu-backend/prisma/migrations/20260912000100_estrutura_estacionamento/migration.sql` | Cria hierarquia, tipos, implantação, posições e relações compostas do P04. |
| `vaggu-backend/prisma/migrations/20260912000200_exclusao_reversivel_gerentes/migration.sql` | Acrescenta exclusão lógica de gerente, estado anterior e restrição de consistência para o desfazer. |
| `vaggu-backend/prisma/migrations/20260913000100_senha_provisoria_e_exclusao_shopping/migration.sql` | Acrescenta exclusão lógica de shopping e a cópia cifrada temporária da senha provisória. |
| `vaggu-backend/prisma/migrations/migration_lock.toml` | Registra o provedor PostgreSQL das migrations do Prisma. |
| `vaggu-backend/prisma/migrations/20260928000100_telemetria_p06/migration.sql` | Acrescenta `INDISPONIVEL` em transação própria para compatibilidade do enum PostgreSQL. |
| `vaggu-backend/prisma/migrations/20260928000200_persistencia_telemetria_p06/migration.sql` | Cria sensores, inicializações, deduplicação persistente e histórico temporal isolado por shopping. |
| `vaggu-backend/prisma/migrations/20260930000100_visao_power_bi_historico/migration.sql` | Expõe o histórico confirmado como intervalos semiabertos compatíveis com o primeiro modelo do Power BI. |
| `vaggu-backend/prisma/migrations/20261014000100_cenario_demonstracao/migration.sql` | Marca shoppings fictícios sem alterar o comportamento dos shoppings existentes. |
| `vaggu-backend/prisma/schema.prisma` | Define entidades, relações e restrições de estrutura, acessos, importação e primeiro recorte persistente de telemetria. |
| `vaggu-backend/scripts/create-admin.ts` | Comando interativo para criar o primeiro administrador e exibir a senha gerada uma única vez no terminal. |
| `vaggu-backend/scripts/criar-cenario-apresentacao.ts` | Garante o Shopping Exemplo na inicialização de produção, sem duplicar dados nem alterar acessos existentes; mantém o comando alternativo de criação explícita. |
| `vaggu-backend/scripts/monitoramento-apresentacao.ts` | Acrescenta quatro placas e 80 sensores ao exemplo com lock transacional, preserva registros existentes e mantém horários de apresentação estáveis. |
| `vaggu-backend/prisma/migrations/20261015000100_nome_shopping_exemplo/migration.sql` | Renomeia somente o cenário fictício conhecido para Shopping Exemplo, preservando contas e histórico. |
| `vaggu-backend/prisma/migrations/20261015000200_mapa_exemplo_sem_sobreposicao/migration.sql` | Distribui os setores do exemplo em faixas distintas do piso, preserva posições personalizadas e incrementa a revisão dos mapas corrigidos. |
| `vaggu-backend/scripts/provisionar-placa.ts` | Cria placa e sensores para vagas existentes, guardando apenas o hash e exibindo a chave uma vez. |
| `vaggu-backend/scripts/simular-telemetria.ts` | Envia heartbeat e observações sintéticas pela mesma API do ESP32, sem inserir fixtures diretamente no banco. |
| `vaggu-backend/scripts/gerar-fixtures-power-bi.ts` | Gera os CSVs sintéticos reproduzíveis da prova matemática e da demonstração ampliada, sem acessar banco ou hardware. |
| `vaggu-backend/src/app.ts` | Monta a API Express, incluindo rotas humanas e de equipamento, restringe conexões externas e entrega o build React quando configurado. |
| `vaggu-backend/src/analiticos/conjunto-controlado.ts` | Define intervalos sintéticos confirmados, calcula métricas ponderadas e gera o CSV reproduzível usado para preparar o Power BI sem simular integração com sensores. |
| `vaggu-backend/src/analiticos/routes.ts` | Expõe a análise histórica do gerente pelo shopping da sessão e a consulta administrativa por shopping, com filtro de datas UTC validado e sem cache compartilhado. |
| `vaggu-backend/src/analiticos/service.ts` | Consulta a view de intervalos confirmados e calcula ocupação, cobertura e entradas no período escolhido, ponderadas pelo tempo. |
| `vaggu-backend/src/auth/bootstrap.ts` | Cria o primeiro administrador por uma operação de terminal, sem cadastro público. |
| `vaggu-backend/src/auth/middleware.ts` | Autentica Bearer ou cookie HttpOnly, exige cabeçalho ant-CSRF nas escritas por cookie e fornece escopo às rotas. |
| `vaggu-backend/src/auth/password.ts` | Protege senhas com scrypt e sal aleatório; guarda o resultado derivado, nunca a senha original. |
| `vaggu-backend/src/auth/routes.ts` | Expõe login, identidade, troca de senha e logout; emite/remove cookie HttpOnly sem expor token ao cliente web. |
| `vaggu-backend/src/auth/service.ts` | Valida credenciais, emite sessões opacas, recusa contas excluídas e aplica a troca obrigatória ou voluntária sem expor hashes. |
| `vaggu-backend/src/config/database.ts` | Valida e normaliza a URL PostgreSQL usada pelo backend sem expor credenciais. |
| `vaggu-backend/src/config/env.ts` | Converte variáveis do processo em configuração da API e valida banco, porta, lacuna e timeouts provisórios da telemetria. |
| `vaggu-backend/src/estrutura/routes.ts` | Expõe configuração administrativa e consulta isolada da estrutura pelo gerente. |
| `vaggu-backend/src/estrutura/service.ts` | Valida hierarquia e revisões do mapa; projeta monitoramento individual e contato da placa sem retornar chaves ou hashes. |
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
| `vaggu-backend/prisma/migrations/20260925000100_remover_foto_shopping/migration.sql` | Remove do schema atual a coluna legada de imagem do shopping sem reescrever migrations já aplicadas. |
| `vaggu-backend/test/importacao-postgresql.test.ts` | Verifica persistência, isolamento de consulta e preservação de vagas e histórico em PostgreSQL descartável. |
| `vaggu-backend/src/conta/routes.ts` | Expõe consulta e edição da conta usando exclusivamente a identidade da sessão. |
| `vaggu-backend/src/conta/service.ts` | Atualiza somente dados pessoais permitidos, sem conceder mudanças de perfil ou shopping. |
| `vaggu-backend/src/lib/prisma.ts` | Cria o cliente Prisma compartilhado; serviços aceitam cliente transacional por injeção. |
| `vaggu-backend/src/server.ts` | Garante o Shopping Exemplo em produção antes de iniciar HTTP, conecta serviços e executa a expiração periódica dos sensores. |
| `vaggu-backend/src/shoppings/routes.ts` | Rotas administrativas de cadastro, ficha, gerentes, exclusões e emissão de senha provisória. |
| `vaggu-backend/src/shoppings/service.ts` | Valida a ficha, administra shoppings e gerentes, agrega a estrutura ativa para a visão geral e entrega senha provisória somente na emissão. |
| `vaggu-backend/src/telemetria/confirmacao-estado.ts` | Calcula a confirmação temporal de leituras de vaga já validadas, sem receber telemetria ou persistir dados. |
| `vaggu-backend/src/telemetria/contratos.ts` | Valida placa, inicialização, sequência e lote de sensores, além de exigir credencial `Device` no cabeçalho. |
| `vaggu-backend/src/telemetria/expiracao.ts` | Marca sensores operacionais silenciosos como indisponíveis uma única vez; exclui shoppings de demonstração para preservar a fotografia de apresentação. |
| `vaggu-backend/src/telemetria/routes.ts` | Expõe heartbeat e estados do ESP32 sem reutilizar cookies ou sessões humanas. |
| `vaggu-backend/src/telemetria/service.ts` | Autentica placa, serializa eventos, deduplica sequência, persiste candidatos e confirma estados/histórico atomicamente. |
| `vaggu-backend/src/whatsapp/client.ts` | Cliente de envio de texto pela API da Meta; recebe configuração privada e transporte substituível em testes. |
| `vaggu-backend/src/whatsapp/payload.ts` | Interpreta o formato externo do webhook e mantém os textos do menu demonstrativo. |
| `vaggu-backend/src/whatsapp/routes.ts` | Recebe o desafio de configuração e os eventos da Meta, validando sua origem antes de processá-los. |
| `vaggu-backend/src/whatsapp/service.ts` | Coordena mensagens recebidas, deduplicação persistente, retomada de eventos abandonados e respostas do menu demonstrativo. |
| `vaggu-backend/src/whatsapp/signature.ts` | Calcula e verifica assinaturas HMAC para confirmar que o corpo recebido veio de quem possui o segredo Meta. |
| `vaggu-backend/test-support/admin-cases.ts` | Verifica acessos administrativos, credencial não reversível, bloqueio, exclusão, prazo para desfazer e reutilização segura do e-mail. |
| `vaggu-backend/test-support/auth-cases.ts` | Cenários sequenciais de autenticação, conta própria, troca obrigatória ou voluntária e isolamento, usados pelo runner com banco exclusivo. |
| `vaggu-backend/test/auth-cookie.test.ts` | Verifica cookie HttpOnly, restauração da identidade, proteção ant-CSRF e limpeza no logout sem banco real. |
| `vaggu-backend/test-support/banco-de-teste.ts` | Prepara um banco PostgreSQL exclusivo por execução e aplica as migrations versionadas. |
| `vaggu-backend/test-support/estrutura-cases.ts` | Verifica hierarquia, mapa, implantação e isolamento do P04 em PostgreSQL real. |
| `vaggu-backend/test/app.test.ts` | Verifica montagem da API, saúde, prontidão, política de conexões do navegador e respostas para rotas inexistentes. |
| `vaggu-backend/test/env.test.ts` | Verifica banco, porta e parâmetros configuráveis da telemetria, incluindo a lacuna menor que 30 segundos. |
| `vaggu-backend/test/integracao-acessos.test.ts` | Executa os cenários HTTP de autenticação e administração em PostgreSQL descartável. |
| `vaggu-backend/test/importacao-csv.test.ts` | Verifica a prévia CSV do P05, incluindo normalização, duplicatas, colunas ausentes e sintaxe inválida. |
| `vaggu-backend/test/confirmacao-estado.test.ts` | Verifica janela, continuidade, alternância e leituras repetidas na confirmação temporal do P06. |
| `vaggu-backend/test/metricas-ocupacao.test.ts` | Reproduz as métricas analíticas esperadas e garante que o CSV sintético versionado não diverge do conjunto tipado. |
| `vaggu-backend/test/analiticos.test.ts` | Verifica métricas históricas, filtro de datas, estado vazio e isolamento da rota analítica pelo shopping autenticado. |
| `vaggu-backend/test/cenario-apresentacao.test.ts` | Cria o cenário em PostgreSQL descartável e verifica shopping, gerentes, vagas, histórico e repetição segura; incluído em `test:integracao` e `npm test`. |
| `vaggu-backend/test/fixtures/power-bi/conjunto-controlado-ocupacao.csv` | Fornece ao Power BI um conjunto sintético identificado de duas vagas durante uma hora, sem gravar fixtures em banco persistente. |
| `vaggu-backend/test/fixtures/power-bi/demonstracao-ampliada-ocupacao.csv` | Fornece ao protótipo visual um cenário sintético reproduzível de sete dias, dois andares, quatro setores e dezesseis vagas, sem simular ingestão de sensores. |
| `vaggu-backend/test/importacao-routes.test.ts` | Verifica autorização e transporte HTTP da prévia CSV administrativa. |
| `vaggu-backend/test/prisma-postgresql.test.ts` | Confere provider, relações, índices e migrations PostgreSQL, incluindo o recorte persistente P06. |
| `vaggu-backend/test/telemetria-contratos.test.ts` | Verifica payload do ESP32, lote atômico, estados aceitos e credencial exclusiva do cabeçalho. |
| `vaggu-backend/test/telemetria-postgresql.test.ts` | Exercita confirmação, deduplicação e expiração individual em PostgreSQL descartável quando `TEST_DATABASE_URL` existe. |
| `vaggu-backend/test/telemetria-routes.test.ts` | Confere transporte HTTP e status distintos para evento novo e reenvio idempotente. |
| `vaggu-backend/test/whatsapp.test.ts` | Verifica assinatura, desafio, interpretação, deduplicação e respostas do webhook WhatsApp. |
| `vaggu-backend/tsconfig.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/components.json` | Configura aliases e estilo de geração dos componentes shadcn. |
| `vaggu-frontend/eslint.config.js` | Configura o ESLint para TypeScript, React Hooks e recarga do Vite. |
| `vaggu-frontend/index.html` | Documento de entrada do Vite e ponto de montagem do React. |
| `vaggu-frontend/package-lock.json` | Fixa a árvore de dependências e integridade para instalação reproduzível via npm ci. |
| `vaggu-frontend/package.json` | Declara dependências, faixa do Node e scripts de desenvolvimento, build e verificação. |
| `vaggu-frontend/public/assets/mockup-laptop-vaggu.svg` | Fonte SVG válida do notebook, preservada para edição e recuperação do raster original; a interface carrega o WebP. |
| `vaggu-frontend/public/assets/vaggu-logo-white.svg` | Variante vetorial branca da marca, sem filtro de sombra, usada na landing e em outras superfícies escuras. |
| `vaggu-frontend/public/assets/vaggu-logo-yellow.svg` | Variante amarela do logotipo preservada no catálogo público; não está montada nas telas atuais. |
| `vaggu-frontend/public/assets/vaggu-logo.svg` | Asset visual vaggu-logo.svg; reutilizado na identidade e composição da interface. |
| `vaggu-frontend/src/app/app-store.tsx` | Restaura identidade via cookie e `/auth/me` antes de liberar rotas; gerencia expiração, logout, troca de senha e consultas. |
| `vaggu-frontend/src/components/brand.tsx` | Reutiliza os arquivos de marca publicados em public/assets nos links para a página inicial. |
| `vaggu-frontend/src/components/analise-estacionamento.css` | Define o painel analítico responsivo, com superfícies próprias nos temas claro/escuro, animações reduzíveis e estados interativos acessíveis. |
| `vaggu-frontend/src/components/analise-estacionamento.tsx` | Filtra medições por datas UTC, compara com o período anterior, distingue situação atual e histórico, identifica a demonstração e permite exportar Excel e PDF. |
| `vaggu-frontend/src/components/resumo-analitico-admin.tsx` | Resume ocupação, cobertura e tendência do shopping selecionado na ficha Admin, distinguindo histórico real de demonstração. |
| `vaggu-frontend/src/components/dashboard-shell.tsx` | Compartilha cabeçalho e conteúdo centralizados, menu responsivo, cartão de conta no rodapé da sidebar, diálogo da conta, alternância claro/escuro e saída da sessão. |
| `vaggu-frontend/src/components/estrutura-admin.tsx` | Permite criar a hierarquia, explica o estado real de implantação e alterna cadastro, mapa e posições com refetch após mutações. |
| `vaggu-frontend/src/components/exportacao-estrutura.tsx` | Abre a janela de exportação estrutural, mostra o recorte e inicia o download XLSX sob demanda. |
| `vaggu-frontend/src/components/importacao-estrutura.tsx` | Permite ao Admin baixar o modelo CSV, enviar CSV/XLSX, revisar registros e erros, confirmar a importação e consultar o resumo aplicado. |
| `vaggu-frontend/src/components/formulario-alterar-senha.tsx` | Compartilha a troca voluntária de senha com validação por campo, requisitos visíveis e confirmação da senha atual. |
| `vaggu-frontend/src/components/formulario-shopping.tsx` | Compartilha cadastro e edição em três etapas; consulta CEP e mantém o endereço editável manualmente. |
| `vaggu-frontend/src/components/mapa-estacionamento.tsx` | Busca a estrutura isolada do gerente, mostra aviso de implantação sem ocultá-la e delega o desenho ao componente compartilhado. |
| `vaggu-frontend/src/components/minha-conta.tsx` | Compartilha dados pessoais em layout responsivo entre Admin e gerente; mantém vínculos protegidos e abre a troca de senha em diálogo sob demanda. |
| `vaggu-frontend/src/components/detalhes-vaga.tsx` | Exibe localização, situação do sensor, placa, horários independentes, estado confirmado e confirmação pendente. |
| `vaggu-frontend/src/components/editor-mapa-vagas.tsx` | Edita posições por arraste, toque ou teclado, ajusta tamanho/rotação e mantém rascunho, desfazer, limites e prevenção de sobreposição. |
| `vaggu-frontend/src/components/monitoramento-sensores.tsx` | Mostra contagens e cartões dos sensores, filtra situação e abre os detalhes no recorte de vagas autorizado. |
| `segunda-mente/Vaggu/Documentação/edicao-visual-e-monitoramento.md` | Documenta fluxos, contratos, origem dos dados, apresentação, testes e limites da entrega de 15/10. |
| `vaggu-frontend/src/components/visualizacao-vagas.tsx` | Compartilha mapa 2D, busca, filtros e seleção entre Admin e gerente; abre o mesmo detalhe pelo mapa, lista móvel ou vaga sem posição. |
| `vaggu-frontend/src/components/icone-whatsapp.tsx` | Disponibiliza o símbolo usado nos links de atendimento, sem requisições externas. |
| `vaggu-frontend/src/components/operacao-vaggu.css` | Foto e conteúdo dividem a seção sem impor uma altura vazia acima dos benefícios. |
| `vaggu-frontend/src/components/operacao-vaggu.tsx` | Relaciona a imagem de movimento urbano aos benefícios da gestão e ao atendimento. |
| `vaggu-frontend/src/components/protected-route.tsx` | Aguarda a sessão e exibe carregamento/erro com cores do tema, foco visível e nova tentativa; autorização de recursos continua no backend. |
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
| `vaggu-frontend/src/lib/constants.ts` | Publica links de contato somente após configurar o número oficial da VAGGU. |
| `vaggu-frontend/src/lib/utils.ts` | Combina classes condicionais e resolve conflitos de utilitários Tailwind. |
| `vaggu-frontend/src/main.tsx` | Inicializa o React, respeita a preferência de movimento reduzido e reúne tema, mensagens, sessão e rotas autenticadas, incluindo análise e prévia de telões do gerente. |
| `vaggu-frontend/src/pages/admin-page.tsx` | Implementa a visão geral administrativa, cadastro, lista e ficha do shopping; o resumo inclui análise compacta e estrutura/mapa e gerentes mantêm seus fluxos próprios. |
| `vaggu-frontend/src/pages/area-autenticada.tsx` | Centraliza mapa e análise do gerente; a rota legada de conta mantém o painel ao fundo enquanto o diálogo compartilhado abre. |
| `vaggu-frontend/src/pages/landing-page.tsx` | Compõe a landing pública, respeita movimento reduzido e mantém contato, temas e rodapé móvel legíveis. |
| `vaggu-frontend/src/pages/login-page.css` | Define composição responsiva do login, troca de senha e desenho animado do rabisco em “vagas”. |
| `vaggu-frontend/src/pages/login-page.tsx` | Entrada única para Admin e gerente, sem solicitar preenchimento automático das credenciais ao abrir a página. |
| `vaggu-frontend/src/pages/pagina-nao-encontrada.tsx` | Exibe a rota 404 pública, oferece retorno à landing e compõe a animação semântica da vaga liberada. |
| `vaggu-frontend/src/pages/pagina-nao-encontrada.css` | Define o layout responsivo e a sequência única em que o carro deixa o sensor vermelho, sai pela esquerda e libera o estado verde. |
| `vaggu-frontend/src/pages/trocar-senha-page.tsx` | Exige uma senha definitiva e reaproveita na aba a senha provisória digitada no login. |
| `vaggu-frontend/src/servicos/api.ts` | Cliente da API na mesma origem para JSON e corpos binários; envia cookie e cabeçalho ant-CSRF sem ler o token. |
| `vaggu-frontend/src/servicos/analise.ts` | Valida ocupação, cobertura, entradas e séries históricas antes de substituir os gráficos demonstrativos. |
| `vaggu-frontend/src/servicos/apresentacao-vaga.ts` | Centraliza os rótulos em português das categorias e estados usados no mapa, nas listas e no detalhe da vaga. |
| `vaggu-frontend/src/servicos/cep.ts` | Consulta o ViaCEP com validação, prazo e erros distintos; devolve somente campos de endereço usados no formulário. |
| `vaggu-frontend/src/servicos/situacao-implantacao.ts` | Centraliza rótulos, descrições e cores dos estados de implantação já definidos no backend. |
| `vaggu-frontend/src/servicos/estrutura.ts` | Valida a árvore pública de andares, setores, vagas e posições recebida da API. |
| `vaggu-frontend/src/servicos/exportacao-estrutura.ts` | Gera no navegador um XLSX estilizado com vagas e resumo da estrutura já carregada, sem endpoint novo nem dados históricos. |
| `vaggu-frontend/src/servicos/modelo-relatorio-analise.ts` | Consolida fotografia atual, séries dos gráficos, histórico confirmado e demonstração separada; prepara a logo e os nomes de arquivo. |
| `vaggu-frontend/src/servicos/exportar-analise-xlsx.ts` | Gera planilha Excel com filtro, comparação, setores, séries dos gráficos e origem explícita dos dados. |
| `vaggu-frontend/src/servicos/exportar-analise-pdf.ts` | Gera relatório PDF paginado com filtro, comparação, indicadores, setores e séries dos gráficos, preservando nomes longos e a origem dos dados. |
| `vaggu-frontend/src/servicos/importacao.ts` | Valida as respostas da API de prévia e confirmação antes de entregá-las à interface administrativa. |
| `vaggu-frontend/src/servicos/politica-senha.ts` | Centraliza requisitos, mensagens locais e códigos de erro da senha definitiva para as duas jornadas de troca. |
| `vaggu-frontend/src/servicos/shoppings.ts` | Valida fichas, listas, agregados estruturais, URL HTTPS de imagem e gerentes recebidos pelas rotas administrativas. |
| `vaggu-frontend/src/types/app.ts` | Declara o contrato da identidade autenticada compartilhado pela interface. |
| `vaggu-frontend/src/types/estrutura.ts` | Declara os contratos TypeScript da estrutura, implantação, tipos e mapa. |
| `vaggu-frontend/src/types/admin.ts` | Declara os contratos TypeScript da ficha administrativa, seus agregados cadastrais e os gerentes. |
| `vaggu-frontend/src/types/importacao.ts` | Declara prévias, erros, registros e resumos da importação estrutural. |
| `vaggu-frontend/src/vite-env.d.ts` | Disponibiliza ao TypeScript os tipos de ambiente fornecidos pelo Vite. |
| `vaggu-frontend/tsconfig.app.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/tsconfig.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/tsconfig.node.json` | Configura compilação TypeScript e limites dos arquivos incluídos neste projeto. |
| `vaggu-frontend/vite.config.ts` | Configura React, Tailwind, aliases e proxy local de /api para o backend. |


## Prévia dos telões — atualização de 17/10/2026

| Arquivo | Responsabilidade |
| --- | --- |
| `vaggu-frontend/src/pages/telao-page.tsx` | Apresenta prévia autenticada de disponibilidade por andar/setor, consulta o escopo do gerente a cada 30 segundos, não possui controles interativos e oculta contagens quando as leituras não são confiáveis. |
| `vaggu-frontend/src/pages/telao-page.css` | Define layout de alto contraste para telão, legibilidade a distância e adaptação a telas menores. |

### Visual do telão — 17/10/2026

O telão foi redesenhado com a referência visual do projeto, logo oficial e tipografia do site. A página calcula faixas provisórias pela proporção de vagas livres monitoradas e mantém dados incompletos em estado neutro.

### Análises — cobertura por setor e centro da rosca — 17/10/2026

O componente `analise-estacionamento.tsx` exibe cobertura histórica por setor à direita de Tipo de vaga, a partir de `porSetor.coberturaPercentual` da API, respeitando o período consultado (SSD §10.2). Sem histórico, mantém aviso de ausência de dados; Shopping Exemplo identifica histórico demonstrativo. Barras de 0–100% representam tempo conhecido, não disponibilidade de vagas. O CSS limita o texto central da rosca ao diâmetro interno e divide “ocupadas agora” em duas linhas. Build aprovado e composição conferida no navegador local a 1440 px.

| Arquivo | Responsabilidade |
| --- | --- |
| segunda-mente/Vaggu/Documentação/entrega-teloes-analises-2026-10-17.md | Consolida mudanças, prints atuais, verificações e pendências de telões e análises. |


### Evidências de sprints recebidas em 19/10/2026

As quatro fotos em `Evidências visuais/Planejamento/sprint-03-09-a-16-09-2026.jpeg`, `sprint-04-23-a-30-09-2026.jpeg`, `sprint-05-05-a-19-10-2026.jpeg` e `sprint-06-19-a-28-10-2026.jpeg` sustentam o calendário vigente. Origem dos anexos e limites constam no [índice de evidências](../Evid%C3%AAncias%20visuais/%C3%8Dndice%20de%20evid%C3%AAncias.md); responsáveis e regra de registro estão em [Sprints do projeto](../Planejamento/Sprints%20do%20projeto.md).

## Conclusão do software — arquivos acrescentados em 19/10/2026

Regras, contratos, operação e limitações estão em [conclusao-software-2026-10-19.md](conclusao-software-2026-10-19.md). O [plano de conclusão](../Planejamento/Conclus%C3%A3o%20do%20software.md) acompanha os aceites; implementação local não comprova homologação publicada.

| Caminho | Responsabilidade |
| --- | --- |
| `segunda-mente/Vaggu/Documentação/conclusao-software-2026-10-19.md` | Consolida as novas regras, endpoints, migrações, renovação do exemplo e limites de validação. |
| `segunda-mente/Vaggu/Planejamento/Conclusão do software.md` | Ordena as etapas da solicitação, critérios de aceite, andamento e dependências externas. |
| `vaggu-backend/prisma/migrations/20261019000100_classificacao_historica/migration.sql` | Congela classificação em novas inserções do histórico e expõe snapshots na view; marca legado como não confirmado. |
| `vaggu-backend/prisma/migrations/20261019000200_operacao_equipamentos/migration.sql` | Cria ocorrências e campos de manutenção com integridade de vínculo por shopping, placa e sensor. |
| `vaggu-backend/prisma/migrations/20261019000300_teloes/migration.sql` | Persiste instalações de telões com credencial em hash, ativação e recorte consistente. |
| `vaggu-backend/prisma/migrations/20261019000400_whatsapp_envio_incerto/migration.sql` | Acrescenta ENVIANDO e REVISAO ao status persistido para evitar repetição automática de envio incerto. |
| `vaggu-backend/scripts/renovar-cenario-apresentacao.ts` | Planeja ou aplica transições sintéticas recentes somente no Shopping Exemplo explicitamente marcado, preservando contas e IDs. |
| `vaggu-backend/scripts/backup-banco.ts` | Cria dump explícito sem sobrescrita e permite restauração somente em banco novo local de teste, sem expor credenciais em argumentos. |
| `vaggu-backend/test/backup-postgresql.test.ts` | Ensaios de dump/restauração verificam integridade, restrições e recusa de sobrescrita em bancos isolados. |
| `vaggu-backend/src/equipamentos/ocorrencias.ts` | Deduplica falhas de comunicação e agrupa sensores quando a placa perde contato, preservando manutenção manual. |
| `vaggu-backend/src/equipamentos/routes.ts` | Expõe operações administrativas de equipamentos/manutenção e consulta de ocorrências no shopping da sessão. |
| `vaggu-backend/src/equipamentos/service.ts` | Valida vínculos, administra credenciais e manutenção, invalida leituras e exige nova confirmação no retorno. |
| `vaggu-backend/src/teloes/routes.ts` | Expõe cadastro/revogação administrativa e consulta agregada autorizada por credencial do telão. |
| `vaggu-backend/src/teloes/service.ts` | Valida recortes e credenciais; agrega somente capacidade ativa e leituras válidas sem expor detalhes administrativos. |
| `vaggu-backend/test/analiticos-postgresql.test.ts` | Exercita snapshots históricos, ciclos e isolamento/filtros em PostgreSQL descartável. |
| `vaggu-backend/test/equipamentos-postgresql.test.ts` | Exercita escopo, vínculo, manutenção, recuperação de comunicação, rotação de chave e autorização. |
| `vaggu-backend/test/renovar-cenario-apresentacao.test.ts` | Verifica planejamento, prévia, proteção do exemplo e repetição da renovação. |
| `vaggu-backend/test/teloes-postgresql.test.ts` | Verifica agregação, recorte, credenciais, revogação e isolamento de instalações com banco de teste. |
| `vaggu-frontend/src/components/equipamentos-admin.tsx` | Oferece cadastro, vínculo e manutenção, consulta de ocorrências e exibição única de chaves no Admin. |
| `vaggu-frontend/src/components/teloes-admin.tsx` | Configura nome/recorte da instalação, apresenta chave uma vez e permite revogação. |
| `vaggu-frontend/src/hooks/use-estrutura-atualizada.ts` | Centraliza consulta periódica/manual, descarte de respostas antigas e invalidação por erro ou prazo. |
| `vaggu-frontend/src/pages/telao-instalado-page.tsx` | Exibe agregados com chave própria por aba e oculta contagens quando a consulta perde validade. |
| `vaggu-frontend/src/servicos/validade-estrutura.ts` | Produz estrutura com leituras indisponíveis quando a consulta vence, preservando indicação de manutenção. |
