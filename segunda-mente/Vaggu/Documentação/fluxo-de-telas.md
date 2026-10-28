# VAGGU — fluxo de telas

Configuração atual da bancada em 21/10: mapa com consulta de **2 s**, backend local com confirmação de **5 s**, preservando 30 s como padrão dos demais ambientes. Três canais físicos confirmaram ocupado/livre e apareceram no mapa do gerente. A edição de posições permanece sem polling.

Atualização de 21/10/2026: mapa do gerente e aba Visualizar mapa do Admin consultam estados a cada 5 s após cada resposta, com pausa em aba oculta e recuperação de falha. O editor de posições não recebe atualização periódica. Bancada local com shopping/gerente próprios: ESP32 conectada, leitura de S02 persistida e A02 Livre exibida no mapa. S01/S03 e ensaios das três vagas ainda precisam de validação física completa.

Este documento registra a navegação encontrada na interface, com atualização de edição visual e monitoramento em 15/10/2026 e a compara com as páginas previstas no SSD. **Implementado** significa que existe rota e tela no código atual; não significa que sensores e Power BI estejam concluídos. **Parcial** indica que parte da experiência está pronta. **Ausente** indica que a página foi planejada, mas ainda não existe no site.

Este documento registra a navegação encontrada na interface, com revisão do código em 21/10/2026 e a compara com as páginas previstas no SSD. **Implementado** significa que existe rota e tela no código atual; não significa que sensores e Power BI estejam concluídos. **Parcial** indica que parte da experiência está pronta. **Ausente** indica que a página foi planejada, mas ainda não existe no site.

## Perfis e regras comuns de navegação

| Perfil | Escopo na interface atual |
| --- | --- |
| Visitante | Landing e login. O contato comercial sai da aplicação e continua no WhatsApp quando o número oficial está configurado. |
| Admin VAGGU | Visão geral consolidada, cadastro e listagem de shoppings; na ficha, navegação separada entre visão geral, estrutura/mapa e gerentes. A importação e exportação estrutural abrem janelas na área de estrutura. |
| Gerente | Painel, mapa, análise e gestão dos telões do shopping vinculado; edição de nome e telefone em rota própria de conta. |

As rotas administrativas e do gerente passam por proteção de sessão e perfil. Sem sessão, o usuário volta para `/login`; com troca de senha obrigatória, vai para `/trocar-senha`; com perfil incompatível, é redirecionado para `/admin` ou `/painel`. Endereços desconhecidos exibem a página 404, com ação de retorno para `/`.

A sessão persiste em cookie HttpOnly de mesma origem. Ao recarregar uma rota protegida, o frontend aguarda `/auth/me` antes de renderizar ou redirecionar; uma sessão expirada ou revogada volta ao login. A identidade pública fica somente em memória React.

## Rotas implementadas

| Rota/tela | Perfil | Origem | Destino | Ações principais | Resultado observado no código | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| `/` — Landing | Visitante | Acesso direto; retorno pelo logotipo ou pelo link “Voltar para o site” | `/login`; WhatsApp externo | Conhecer a solução, percorrer as seções da apresentação, abrir contato comercial e acessar o login | O rodapé móvel reúne marca, chamada comercial e links existentes, sem repetir a imagem de celulares. Seu CTA do WhatsApp depende do número oficial configurado; outros CTAs da landing ainda precisam dessa mesma proteção | Implementado, com a ressalva indicada |
| `/login` — Entrada única | Visitante, Admin e gerente | Landing; tentativa de abrir rota protegida; logout; sessão expirada | `/trocar-senha`, `/admin` ou `/painel`; WhatsApp de suporte externo quando configurado | Informar e-mail e senha, mostrar/ocultar senha e solicitar orientação em “Esqueci minha senha” | A API valida a credencial; primeiro acesso segue para troca obrigatória e os demais seguem pelo perfil | Implementado |
| `/trocar-senha` — Troca obrigatória | Admin ou gerente autenticado com senha provisória | Login; redirecionamento das rotas protegidas | `/admin` ou `/painel`; `/login` ao sair | Informar senha provisória, nova senha e confirmação; acompanhar requisitos; mostrar/ocultar cada campo; sair | Substitui a senha provisória antes de liberar a área operacional | Implementado para o primeiro acesso; a troca posterior fica em Minha conta |
| `/admin` — Visão geral administrativa | Admin | Login; menu “Visão geral”; redirecionamento por perfil | `/admin/cadastrar`, `/admin/shoppings` e fichas individuais | Consultar totais de shoppings, operações ativas, implantações, acessos e lacunas cadastrais verificáveis | Usa somente a listagem administrativa persistida; não apresenta comunicação ou saúde de sensores como disponíveis | Implementado |
| `/admin/cadastrar` — Cadastro de shopping | Admin | Visão geral; navegação “Cadastrar shopping” | `/admin/shoppings/:shoppingId`; `/admin/shoppings` pelo menu | Cadastrar identificação, endereço e operação em três etapas | Valida os campos de cada etapa antes de avançar, preserva os valores ao voltar e abre a ficha após criar | Implementado |
| `/admin/shoppings` — Lista de shoppings | Admin | Menu “Shoppings”; retorno da ficha | `/admin/shoppings/:shoppingId`; `/admin/cadastrar` | Buscar por shopping/cidade, abrir ficha e iniciar novo cadastro | Lista os registros retornados pela API e informa carregamento ou ausência de resultados | Implementado |
| `/admin/shoppings/:shoppingId` — Visão geral do shopping | Admin | Lista; criação concluída; link direto autorizado | `/admin/shoppings/:shoppingId/estrutura`, `/admin/shoppings/:shoppingId/gerentes`; `/admin/shoppings` após excluir | Consultar contatos, contagens e análise compacta; abrir edição cadastral sob demanda e excluir com confirmação | A análise usa histórico do shopping e mostra detalhes por mouse ou teclado e mantém estados sem leitura confirmada como indisponíveis | Implementado |
| `/admin/shoppings/:shoppingId/estrutura` — Estrutura e mapa | Admin | Menu contextual da ficha; atalho na visão geral | Visão geral e gerentes da mesma ficha | Configurar andares, setores, vagas e posições; alternar configuração, mapa e edição de posições; abrir o detalhe de uma vaga; importar CSV/XLSX e exportar estrutura por janelas | As posições são editadas diretamente por arraste, toque e teclado; o detalhe e a lista de monitoramento recebem situação, placa, horários individuais e confirmação pendente da API. O XLSX é um retrato da estrutura, não um relatório histórico. As alterações atualizam a estrutura sem recarregar a página | Implementado; Equipamentos e Telões ficam na configuração desta rota, sem página separada de equipamentos |
| `/admin/shoppings/:shoppingId/gerentes` — Gerentes | Admin | Menu contextual da ficha | Visão geral e estrutura da mesma ficha | Criar, editar, bloquear, reativar, redefinir senha e excluir gerente; copiar senha provisória na resposta imediata | Exclusão oferece sete segundos para desfazer; senha provisória não volta na listagem | Implementado |
| `/painel` — Estacionamento | Gerente | Login; menu “Estacionamento”; redirecionamento por perfil | `/painel/analise`, diálogo de conta; WhatsApp externo para solicitar alteração, quando configurado; `/login` ao sair | Navegar por andares, buscar e filtrar vagas, consultar mapa/lista, monitoramento dos sensores e detalhes individuais | Usa somente o shopping derivado da sessão. No ambiente operacional, o mapa confere a validade da leitura individual; dado vencido ou ausente não vira vaga livre. O exemplo mantém sua fotografia de apresentação | Implementado para consulta; gerente acompanha ocorrências, enquanto cadastro e manutenção continuam restritos ao Admin |
| `/painel/analise` — Análise | Gerente | Menu “Análise” | `/painel`, diálogo de conta; `/login` ao sair | Filtrar até 31 dias UTC, setor e categoria; comparar período anterior, consultar métricas/gráficos e exportar Excel ou PDF | O histórico confirmado alimenta ocupação, cobertura e entradas do recorte selecionado. Sem medições no filtro, a tela mostra estado vazio; os arquivos registram datas, comparação e origem dos dados. A situação atual das vagas fica separada do período | Implementado localmente: setor/categoria, entradas, saídas, permanência, rotatividade e cobertura; homologação publicada pendente |
| `/painel/conta` — Minha conta | Gerente | Cartão de conta no rodapé da sidebar ou link direto legado | `/painel` ao fechar; `/login` ao sair | Editar nome e telefone; trocar a senha mediante confirmação da atual | Abre diálogo centralizado sobre o painel; não altera e-mail, perfil ou vínculo com shopping | Implementado |
| `/admin/conta` — Minha conta | Admin | Cartão de conta no rodapé da sidebar ou link direto legado | `/admin` ao fechar; `/login` ao sair | Editar nome e telefone; trocar a senha mediante confirmação da atual | Abre o mesmo diálogo centralizado, sem permitir mudança de perfil | Implementado |
| `/painel/teloes` — Gestão dos telões | Gerente | Menu “Telões” | Prévias geral/andar e `/telao/:id` | Cadastrar instalação, escolher visão geral/andar, salvar exibição e revogar acesso | Shopping derivado da sessão; edição mantém a credencial; prévias abrem em nova aba | Protótipo funcional local validado |
| `/telao/:id` — Telão instalado | Instalação autorizada | Endereço emitido na gestão do gerente ou na configuração administrativa | Própria exibição | Exibir agregados do recorte; atualizar a cada 15 segundos; ocultar leituras vencidas ou em falha | Usa credencial própria revogável e não exige sessão administrativa; gerente e Admin escolhem a exibição por instalação; tela cheia/Esc e grade sem rolagem | Implementado localmente; instalação física e homologação publicada pendentes |
| `*` — Página não encontrada | Qualquer | URL não reconhecida | `/`; seção Sobre; WhatsApp quando configurado | Assistir à vaga ser liberada uma vez e retornar à tela inicial | Exibe uma 404 própria; o carro sai da vaga, o sensor muda de vermelho para verde e a animação reinicia somente ao recarregar a página | Implementado |

## Conteúdo real da ficha administrativa

A ficha possui três rotas contextuais: visão geral para dados e resumo; estrutura para implantação, importação, exportação, cadastro e mapa 2D; gerentes para acessos individuais. A estrutura alterna configuração de vagas, visualização do mapa e edição de posições. Importação e exportação abrem janelas sem afastar o Admin do contexto do shopping.

O resumo não converte ausência de leitura em vaga livre. A ficha já mostra uma análise compacta com histórico real quando disponível e uma prévia identificada quando não há dados. Ela não substitui o relatório completo nem o Power BI.

## Funcionalidades previstas e correspondência atual

| Página prevista no SSD | Perfil | Origem esperada | Ações esperadas | Destino/resultado esperado | Estado atual |
| --- | --- | --- | --- | --- | --- |
| Equipamentos | Admin | Configuração em `/admin/shoppings/:shoppingId/estrutura` | Cadastrar placa, rotacionar chave, vincular sensor, abrir/concluir manutenção e consultar ocorrências | Equipamentos e falhas no shopping correto | Implementado como seção, sem rota própria |
| Atendimentos | Admin | Navegação administrativa | Consultar e encaminhar demonstrações e solicitações de suporte | Continuidade do contato no WhatsApp sem criar acesso automaticamente | Ausente; rota web não definida |
| Análises e relatórios | Gerente | Navegação do painel | Consultar histórico por datas, comparar período anterior e exportar Excel/PDF | Indicadores e arquivos restritos ao shopping da sessão | Implementado em `/painel/analise`: datas, comparação, setor/categoria, entradas/saídas, permanência, rotatividade e cobertura |
| Minha conta e troca voluntária de senha | Admin ou gerente | Cartão no rodapé da sidebar | Abrir conta em diálogo, editar dados permitidos e solicitar troca de senha | Conta atualizada sem mudar perfil ou vínculo com shopping; formulário de segurança aparece somente quando solicitado | Implementado; `/admin/conta` e `/painel/conta` continuam abrindo o diálogo por link direto |
| Telão de entrada | Gerente autenticado (prévia) | `/painel/telao` | Exibir vagas livres confirmadas por andar e leitura atual | Categorias especiais sem duplicar o total; números indisponíveis mostrados como “—”, sem avisos técnicos de parcialidade | Prévia autenticada implementada; instalação web `/telao/:id` usa credencial própria e recorte definido pelo gerente ou Admin, com salvamento explícito |
| Telão de andar | Gerente autenticado (prévia) | `/painel/telao/andares/:andarId` | Exibir vagas livres confirmadas por setor | Contagens por setor e categorias, tela cheia/Esc e números indisponíveis como “—” | Prévia autenticada implementada; instalação web `/telao/:id` usa credencial própria e recorte definido pelo gerente ou Admin, com salvamento explícito |

O WhatsApp é um canal externo à navegação web. Landing e login apenas abrem o contato configurado; o menu automatizado e o atendimento humano não devem ser descritos como páginas do frontend.

## Divergências entre interface, backend e evidências

### Exclusão de gerente

O backend mantém `DELETE /gerentes/:gerenteId` e `POST /gerentes/:gerenteId/desfazer-exclusao`, com janela de sete segundos para desfazer. A ficha atual confirma a exclusão, remove o acesso da lista e apresenta a ação “Desfazer” durante a mesma janela aceita pelo servidor.

As imagens `confirmacao-excluir-gerente.png` e `aviso-desfazer-exclusao.png` continuam sendo evidências históricas da versão anterior. Uma nova captura autenticada ainda deve substituir as imagens antigas como evidência visual da ficha atual.

### Exclusão de shopping

O backend mantém `DELETE /shoppings/:shoppingId`, e a ficha atual exibe a ação com confirmação explícita. Após a exclusão, o Admin retorna à lista; os acessos são encerrados e a estrutura e o histórico permanecem preservados. Não há desfazer para shopping no contrato atual.

### Evidências visuais anteriores

As capturas de P02, P03, P04 e “Melhorias — interações e gerentes” preservam o estado observado em validações anteriores. Elas continuam úteis para histórico, comparação e regressão, mas não substituem uma captura da versão presente. Antes de declarar uma tela validada, gerar nova evidência a partir da rota atual e registrar data, viewport, perfil e cenário.

## Próxima revisão visual

1. criar evidências atuais da ficha, exclusões, importação, mapa, estados vazios, erros e larguras menores;
2. validar as novas rotas e janelas contra a API hospedada e com usuários reais, sem confundir o ensaio local simulado com essa integração;
3. manter este documento sincronizado com `src/main.tsx` e com os itens reais da navegação.


### Registro histórico — prévia autenticada dos telões em 17/10/2026

O gerente abre “Telões” no painel. A visão de entrada lista disponibilidade confirmada por andar; a rota específica de cada andar mostra os setores. A tela consulta a estrutura da sessão a cada 30 segundos naquela entrega, funciona somente para exibição, sem botões, links ou controles. Estados desconhecidos, indisponíveis, sem monitoramento e sem leitura válida não são somados como livres. Se não houver leitura atual, a contagem fica oculta; leituras incompletas recebem aviso. Shopping marcado como demonstração recebe identificação visível de prévia. As rotas `/painel/telao` e `/painel/telao/andares/:andarId` usam a autenticação e o escopo do gerente existente.

Esta entrega é uma prévia operacional para apresentação e desenvolvimento. Não cria instalação pública/autorização própria de telão, configuração de recorte pelo Admin, rota agregada sem sessão, cadastro de equipamentos, atualização por evento nem vínculo com ESP32 físico. Esse era o limite em 17/10. Cadastro, manutenção, polling e instalação web autorizada foram implementados posteriormente; hardware físico e homologação publicada continuam pendentes.

### Análises — cobertura por setor e centro da rosca — 17/10/2026

O componente `analise-estacionamento.tsx` exibe cobertura histórica por setor à direita de Tipo de vaga, a partir de `porSetor.coberturaPercentual` da API, respeitando o período consultado (SSD §10.2). Sem histórico, mantém aviso de ausência de dados; Shopping Exemplo identifica histórico demonstrativo. Barras de 0–100% representam tempo conhecido, não disponibilidade de vagas. O CSS limita o texto central da rosca ao diâmetro interno e divide “ocupadas agora” em duas linhas. Build aprovado e composição conferida no navegador local a 1440 px.

### Apresentação das análises — 23/10/2026

A rota `/painel/analise` prioriza gráficos de ocupação diária, situação atual, movimentação, categorias e cobertura. A tabela de indicadores históricos por setor inicia recolhida em “Ver indicadores detalhados por setor”. Permanência aparece em horas e minutos; percentuais de destaque são arredondados só na interface. Os filtros UTC/setor/categoria, a comparação e a precisão das exportações permanecem. Dias sem observação preservam lacunas e não viram ocupação zero; situação atual e histórico têm rótulos separados. Capturas e limites estão no índice de evidências de 23/10.

Complemento de 23/10: categorias do cadastro aparecem no topo, respeitando o recorte aplicado. A comparação com o período anterior carrega independentemente dos gráficos atuais. Ao atualizar ou falhar, a última consulta permanece identificada; Atualizar análise/Tentar novamente repetem o recorte aplicado. A primeira carga mostra placeholders e não interpreta espera como ausência de histórico. Exportações aguardam a comparação e carregam seus módulos sob demanda. Séries acima de dez dias permitem rolagem interna para preservar seleção por toque/teclado.


Experimento local de 25/10: indicadores e categorias contam até o valor confirmado; gráficos entram ao alcançar a viewport. A preferência de movimento reduzido remove as entradas e interrompe a contagem, inclusive se alterada com a página aberta. O número acessível e a exportação usam o valor final desde o início. Ver [testes das animações](animacoes-analises-2026-10-25.md).


Revisão de leitura em 25/10: categorias e indicadores têm acentos de cor e mais espaço interno. Cards mostram título, valor e apoio curto; definições ficam em “Como ler os indicadores”. Ausência de permanência usa travessão com “Sem ciclos completos”. Filtros ficam em uma linha no desktop e se reorganizam em telas menores, sem alterar o recorte ou os contratos.

### Equipamentos: orientação de uso — 28/10/2026

Na configuração da estrutura, Equipamentos e manutenção explica placa ESP32, sensor e vaga em três passos. Os campos identificam os códigos usados no equipamento e “Vaga sem sensor” substitui “Vaga disponível”, sem sugerir disponibilidade para estacionar. A ajuda expansível explica manutenção de placa/sensor, renovação de chave e desativação. Os diálogos distinguem o alcance da intervenção. Cadastro não comprova comunicação ou leitura válida. Sem placa ativa ou vaga sem vínculo, a associação fica desabilitada com orientação. Contratos da API preservados.
