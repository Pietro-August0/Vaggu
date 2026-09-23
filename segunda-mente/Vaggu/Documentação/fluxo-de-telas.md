# VAGGU — fluxo de telas

Este documento registra a navegação encontrada no frontend em 23/09/2026 e a compara com as páginas previstas no SSD. **Implementado** significa que existe rota e interface no código atual; não significa que integrações futuras, como telemetria e Power BI, estejam concluídas. **Parcial** indica que parte da experiência está na interface atual. **Ausente** indica que a página foi planejada, mas ainda não possui rota web.

## Perfis e regras comuns de navegação

| Perfil | Escopo na interface atual |
| --- | --- |
| Visitante | Landing e login. O contato comercial sai da aplicação e continua no WhatsApp quando o número oficial está configurado. |
| Admin VAGGU | Cadastro, listagem e ficha de shoppings, incluindo dados, foto, estrutura, mapa, importação e acessos de gerentes. |
| Gerente | Painel do shopping vinculado, mapa e edição de nome e telefone da própria conta. |

As rotas administrativas e do gerente passam por proteção de sessão e perfil. Sem sessão, o usuário volta para `/login`; com troca de senha obrigatória, vai para `/trocar-senha`; com perfil incompatível, é redirecionado para `/admin` ou `/painel`. Qualquer endereço desconhecido volta para `/`.

O token existe somente na memória da aba. Portanto, recarregar a página exige novo login conforme o contrato atual do frontend.

## Rotas implementadas

| Rota/tela | Perfil | Origem | Destino | Ações principais | Resultado observado no código | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| `/` — Landing | Visitante | Acesso direto; retorno pelo logotipo ou pelo link “Voltar para o site” | `/login`; WhatsApp externo | Conhecer a solução, percorrer as seções da apresentação, abrir contato comercial e acessar o login | Apresenta a VAGGU e mantém a parceria fora do cadastro público; o CTA do WhatsApp só aparece quando o número oficial está configurado | Implementado |
| `/login` — Entrada única | Visitante, Admin e gerente | Landing; tentativa de abrir rota protegida; logout; sessão expirada | `/trocar-senha`, `/admin` ou `/painel`; WhatsApp de suporte externo quando configurado | Informar e-mail e senha, mostrar/ocultar senha e solicitar orientação em “Esqueci minha senha” | A API valida a credencial; primeiro acesso segue para troca obrigatória e os demais seguem pelo perfil | Implementado |
| `/trocar-senha` — Troca obrigatória | Admin ou gerente autenticado com senha provisória | Login; redirecionamento das rotas protegidas | `/admin` ou `/painel`; `/login` ao sair | Informar senha provisória, nova senha e confirmação; acompanhar requisitos; mostrar/ocultar cada campo; sair | Substitui a senha provisória antes de liberar a área operacional | Implementado para o primeiro acesso; não atende à troca voluntária posterior |
| `/admin` — Cadastro de shopping | Admin | Login; navegação “Cadastrar”; redirecionamento por perfil | `/admin/shoppings/:shoppingId`; `/admin/shoppings` pelo menu | Cadastrar dados institucionais e operacionais e selecionar foto | Cria o shopping e abre sua ficha; esta rota **não** é uma visão geral administrativa | Implementado |
| `/admin/shoppings` — Lista de shoppings | Admin | Menu “Shoppings”; retorno da ficha | `/admin/shoppings/:shoppingId`; `/admin` | Buscar por shopping/cidade, abrir ficha e iniciar novo cadastro | Lista os registros retornados pela API e informa carregamento ou ausência de resultados | Implementado |
| `/admin/shoppings/:shoppingId` — Ficha do shopping | Admin | Lista; criação concluída; link direto autorizado | `/admin/shoppings`; permanece na ficha após mutações e retorna à lista após excluir o shopping | Editar dados e foto; consultar resumo persistido; importar CSV/XLSX, revisar e confirmar; configurar andares, setores, vagas e posições; criar, editar, bloquear, reativar, redefinir senha e excluir gerente; excluir shopping | Confirma ações destrutivas. A exclusão de gerente oferece sete segundos para desfazer; a de shopping encerra acessos e preserva estrutura e histórico. Estados sem leitura confirmada continuam indisponíveis | Implementado |
| `/painel` — Painel do shopping e Minha conta | Gerente | Login; navegação “Visão geral”; redirecionamento por perfil | WhatsApp externo para solicitar alteração, quando configurado; `/login` ao sair | Navegar por andares, buscar e filtrar vagas, consultar mapa/lista e editar o próprio nome e telefone | Usa somente o shopping derivado da sessão. Exibe aviso de implantação quando necessário. “Minha conta” está na mesma página e não permite trocar a senha definitiva | Parcial: mapa e dados pessoais existem; telemetria, atualização temporal e análises ainda não |
| `*` — Página não encontrada | Qualquer | URL não reconhecida | `/`; seção Sobre; WhatsApp quando configurado | Assistir à vaga ser liberada uma vez e retornar à tela inicial | Exibe uma 404 própria; o carro sai da vaga, o sensor muda de vermelho para verde e a animação reinicia somente ao recarregar a página | Implementado |

## Conteúdo real da ficha administrativa

A ficha concentra responsabilidades que ainda não foram separadas em rotas próprias:

1. dados cadastrais, situação de implantação e foto pública;
2. resumo das vagas com base no estado persistido;
3. prévia e confirmação da importação estrutural;
4. cadastro de andares, setores, vagas e posições no mapa;
5. visualização 2D compartilhada com o gerente;
6. criação, edição, bloqueio, reativação e redefinição de senha dos gerentes.

O resumo não converte ausência de telemetria em vaga livre. A área de análises históricas é apenas uma mensagem de indisponibilidade; não há gráfico ou relatório funcional nessa tela.

## Páginas previstas e ainda não entregues

| Página prevista no SSD | Perfil | Origem esperada | Ações esperadas | Destino/resultado esperado | Estado atual |
| --- | --- | --- | --- | --- | --- |
| Visão geral administrativa | Admin | Login e navegação administrativa | Consultar implantação, comunicação e pendências por shopping | Situação consolidada dos shoppings e falhas que exigem atenção | Ausente. `/admin` abre diretamente o cadastro de shopping |
| Equipamentos | Admin | Navegação administrativa ou ficha do shopping | Consultar placas ESP32, sensores, comunicação e ocorrências | Equipamentos e falhas vinculados ao shopping correto | Ausente; rota web não definida |
| Atendimentos | Admin | Navegação administrativa | Consultar e encaminhar demonstrações e solicitações de suporte | Continuidade do contato no WhatsApp sem criar acesso automaticamente | Ausente; rota web não definida |
| Análises e relatórios | Gerente | Navegação do painel | Selecionar período, consultar histórico e obter resumos autorizados | Comparações, indicadores e exportações restritos ao shopping da sessão | Ausente. Há somente um aviso textual de análise futura na ficha Admin |
| Minha conta dedicada e troca voluntária de senha | Admin ou gerente | Menu da conta | Editar dados permitidos e alterar a senha definitiva | Conta atualizada sem mudar perfil ou vínculo com shopping | Parcial. Nome e telefone do gerente ficam dentro de `/painel`; Admin não possui tela equivalente e não há troca voluntária de senha |
| Telão de entrada | Telão autorizado | Endereço de exibição ainda a definir | Exibir disponibilidade agregada por andar e validade dos dados | Vagas livres e categorias especiais sem duplicação | Ausente; rota web não definida |
| Telão de andar | Telão autorizado | Endereço de exibição ainda a definir | Exibir disponibilidade agregada por setor | Vagas livres por setor e aviso de dados expirados | Ausente; rota web não definida |

O WhatsApp é um canal externo à navegação web. Landing e login apenas abrem o contato configurado; o menu automatizado e o atendimento humano não devem ser descritos como páginas do frontend.

## Divergências entre interface, backend e evidências

### Exclusão de gerente

O backend mantém `DELETE /gerentes/:gerenteId` e `POST /gerentes/:gerenteId/desfazer-exclusao`, com janela de sete segundos para desfazer. A ficha atual confirma a exclusão, remove o acesso da lista e apresenta a ação “Desfazer” durante a mesma janela aceita pelo servidor.

As imagens `confirmacao-excluir-gerente.png` e `aviso-desfazer-exclusao.png` continuam sendo evidências históricas da versão anterior. A implementação atual foi revalidada pelo contrato e por testes; uma nova captura autenticada ainda deve substituir as imagens antigas como evidência visual da ficha atual.

### Exclusão de shopping

O backend mantém `DELETE /shoppings/:shoppingId`, e a ficha atual exibe a ação com confirmação explícita. Após a exclusão, o Admin retorna à lista; os acessos são encerrados e a estrutura e o histórico permanecem preservados. Não há desfazer para shopping no contrato atual.

### Evidências visuais anteriores

As capturas de P02, P03, P04 e “Melhorias — interações e gerentes” preservam o estado observado em validações anteriores. Elas continuam úteis para histórico, comparação e regressão, mas não substituem uma captura da versão presente. Antes de declarar uma tela validada, gerar nova evidência a partir da rota atual e registrar data, viewport, perfil e cenário.

## Próxima revisão visual

1. criar evidências atuais da ficha, exclusões, importação, mapa, estados vazios, erros e larguras menores;
2. separar ou nomear claramente as próximas páginas antes de introduzir novas rotas;
3. manter este documento sincronizado com `src/main.tsx` e com os itens reais da navegação.
