# Validação do login — 11/09/2026

## Resultado

Integração funcional e acabamento visual validados localmente. MCP Figma autentica a conta, mas get_design_context e download_assets atingiram o limite do plano. O frame 2580:30 foi observado no navegador: duas colunas branca/amarela, Poppins, campos cinza, botão amarelo e fotografia recortada no lado direito. Medidas usadas são aproximações da visualização, não valores extraídos pelo MCP.

## Mudanças

- Removidos botões, e-mails e senhas demonstrativos; identidade validada pelo backend.
- Token Bearer opaco em memória, sem persistência no localStorage; recarga exige login.
- /auth/login seguido de /auth/me; /auth/change-password obrigatório quando indicado; /auth/logout revoga a sessão.
- Consulta da identidade a cada 30 segundos com aba visível e ao recuperar foco; backend valida cada requisição. Falhas de verificação bloqueiam conteúdo protegido até recuperação.
- API no mesmo domínio via proxy /api; erros de rede não concedem acesso alternativo.
- Listagem administrativa real; painel do gerente indica preparação. CRUD administrativo e operação não foram entregues por esta etapa.
- WhatsApp oficial inexistente conforme a equipe. Removido número fictício; recuperação informa procurar a equipe no canal da parceria.

## Evidências

Ambiente: Windows, Node 24.18.0, PostgreSQL 17.11 existente, React/Vite e Edge headless via Playwright. Nenhuma dependência nova instalada.

| Verificação | Resultado |
| --- | --- |
| Backend compilado e suíte completa com TEST_DATABASE_URL | 47 passaram, zero falhas e zero pulados |
| Frontend lint | Passou após corrigir espera do logout |
| Frontend build | Passou; aviso de bundle acima de 500 kB |
| Login sem conta preenchida nem links fictícios | Passou |
| Mostrar/ocultar senha e orientação de recuperação | Passou |
| Credenciais inválidas recusadas | Passou |
| Admin consulta registro real no banco isolado | Passou |
| Logout e tentativa de reutilizar token | Passou, token recebeu 401 |
| Gerente direcionado à troca obrigatória | Passou |
| Senha atual errada não encerra sessão | Passou |
| Troca persiste e libera área do gerente | Passou |
| Bloqueio no banco revoga acesso ao recuperar foco | Passou |
| Recarga ignora armazenamento demonstrativo | Passou |
| Falha de conexão não permite acesso | Passou |
| Mobile 390×844 e teclado | Passou, sem overflow horizontal |
| Desktop 1440×1024 | Foto e contorno originais aplicados e conferidos |
| Erros JavaScript não tratados | Nenhum |

A primeira tentativa de integração falhou porque o PostgreSQL estava parado. Após iniciar o serviço existente com autorização, a suíte passou. Os testes criaram banco exclusivo aleatório, aplicaram migrations e descartaram suas fixtures ao final. Não criaram administrador no banco de desenvolvimento.

Evidências locais: C:/Users/CASA/Documents/Codex/validacao-vaggu-2026-09-11 (validar.mjs, resultado.json, login-desktop.png e login-mobile.png). O script E2E importa o backend compilado e requer TEST_DATABASE_URL de teste; executar a partir do backend com Node compatível, arquivo .env.teste.local e Vite em 5173 com API_PROXY_TARGET=http://127.0.0.1:3053.

## Limites e continuidade

Pietro forneceu a foto recortada e o contorno usados no Figma. Ambos foram versionados em `public/assets`, posicionados no painel amarelo e conferidos em 1440×1024 e 390×844. O MCP Figma segue limitado pela cota do plano, portanto não houve nova extração de medidas; a comparação usa o frame previamente observado e os assets originais enviados pela equipe. Nenhum teste comprova deploy, entrega pela Meta, sensores ou Power BI. Recuperação automatizada de senha não foi implementada: a equipe redefine o acesso. Para produção, encaminhar /api à API e demais rotas ao index.html, além de configurar HTTPS. Não houve commit, push ou publicação.
