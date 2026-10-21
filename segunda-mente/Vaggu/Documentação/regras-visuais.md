# VAGGU — regras visuais permanentes

Atualização de aprovação visual: 16/10/2026. Regras iniciais de 09/09/2026.

## 1. Referência e grau de confirmação

**Referência visual vigente: site atual aprovado em 16/10/2026.** Reconhecemos que o site evoluiu e melhorou a proposta criada no Figma. O Figma preserva a origem do projeto; reprodução exata de suas medidas e componentes não é condição para concluir a documentação.

Referência inicial: [Figma VAGGU — página Web](https://www.figma.com/design/xKI9wjoiZ5CoXC3DXIJNmq/Vaggu?node-id=2022-2).

- Arquivo: `xKI9wjoiZ5CoXC3DXIJNmq`.
- Nó indicado: `2022:2`.
- A referência já consultada nos registros de decisão e o documento mestre sustentam a direção visual: amarelo, tons escuros, textos claros, marca VAGGU e interface minimalista.
- Em 09/09, a nova consulta à integração foi bloqueada por limite de chamadas. Não foi possível extrair novamente cores numéricas, fontes, espaçamentos e componentes deste nó.
- Em 23/09, registramos um guia de identidade com paleta hexadecimal e Poppins. Essa imagem é uma fonte interna do projeto, não uma extração do Figma.
- As regras abaixo distinguem **identidade fornecida**, **cores e medidas encontradas no código**, **regras de implementação** e **itens a conferir**.
- Frames podem preservar escopo antigo, como motos. As decisões atuais de produto prevalecem; o site aprovado orienta o resultado visual atual.

## 2. Identidade conhecida e obrigatória

| Elemento | Diretriz |
| --- | --- |
| Marca | Usar a logo correta da VAGGU, mantendo proporções e variantes existentes. |
| Paleta principal | Amarelo de destaque, tons escuros e textos claros, conforme Figma/tokens existentes. |
| Estilo | Minimalista, organizado, legível; prioridade aos dados e à orientação do usuário. |
| Coerência | Mesmos padrões de botão, campo, ícone, borda, card e tipografia ao longo das telas. |
| Ícones | Alinhados, proporcionais e com tratamento consistente; evitar cada ícone sobre um fundo arbitrário diferente. |
| Densidade | Painel operacional com informação útil; telões com leitura rápida e poucas distrações. |
| Dispositivos | Web responsivo em computador, tablet e celular. Não criar visual de aplicativo nativo como novo produto. |

Não importar paletas ou logos de outros projetos. Não transformar a aplicação em um dashboard genérico com gradientes, efeitos e cores sem relação com o Figma. A biblioteca de componentes deve se adaptar à VAGGU.

### Paleta e tipografia dos arquivos de referência do projeto

| Elemento | Valor confirmado na imagem fornecida |
| --- | --- |
| Amarelo principal | `#ffe100` |
| Amarelo intermediário | `#ffeb54` |
| Amarelo claro | `#fff49d` |
| Cinza escuro | `#343231` |
| Carvão | `#171717` |
| Preto | `#000000` |
| Branco | `#ffffff` |
| Família tipográfica da identidade | Poppins |

Evidência versionada: ![[Vaggu/Evidências visuais/Planejamento/guia-identidade-visual-vaggu.png]]

Não atribuir automaticamente um papel funcional a cada cor apenas pela ordem do guia. Fundo, superfície, texto, borda, foco e estados precisam preservar contraste e ser verificados na tela. Cores semânticas de vaga livre, ocupada, indisponível, sucesso e erro não foram definidas por essa imagem.

## 3. Registro de tokens e pendências

Antes de introduzir valores novos, localizar os tokens no repositório e preservar a coerência com o site aprovado. Registrar valor, origem e data. Consultar o Figma para recuperar uma referência inicial ou atender a uma necessidade específica do projeto, sem reverter melhorias aprovadas para igualar medidas antigas.

| Token semântico sugerido | Função | Valor/evidência atual |
| --- | --- | --- |
| `--cor-marca-primaria` | Amarelo principal | `#ffe100`, registrado no guia visual e encontrado como `--primary` no código |
| `--cor-marca-intermediaria` | Variação da marca | `#ffeb54`, registrado no guia visual; uso no código a conciliar |
| `--cor-marca-clara` | Variação clara da marca | `#fff49d`, registrado no guia visual; uso no código a conciliar |
| `--cor-fundo-principal` | Fundo da aplicação | `#171717` aparece no painel Admin; confirmar aplicação por contexto |
| `--cor-superficie` | Cards e áreas elevadas | Entre os tons fornecidos, papel exato ainda pendente de conciliação |
| `--cor-texto-principal` | Texto de maior contraste | Preto ou branco conforme fundo; validar contraste por componente |
| `--cor-texto-secundario` | Metadados e apoio | Papel exato pendente; não assumir que `#343231` atende a todo fundo |
| `--cor-borda` | Separação de elementos | Pendente de conciliação com os tokens reais do código |
| `--cor-foco` | Foco de teclado | Pendente de conferência de contraste |
| `--fonte-principal` | Identidade, texto e controles | Poppins consta do guia visual do projeto; o código ainda usa Geist como sans geral |
| `--fonte-destaque` | Títulos, caso exista distinta | Não confirmada; não assumir que há duas famílias na identidade |
| Espaçamentos, raios e sombras | Consistência de componentes | Extrair escala existente |
| Cores semânticas dos estados | Livre, ocupada, indisponível, atenção | Conferir no design e validar legibilidade |

Os nomes são uma proposta de organização; adaptar aos tokens existentes. Não criar tema paralelo se o projeto já usa tokens CSS/Tailwind. Não usar `null` ou “pendente” dentro de CSS executável: pendências são documentação.

## 4. Tipografia e texto

- Família, peso e proporções vêm do Figma ou dos estilos verificados no projeto.
- Textos da interface em português brasileiro, com acentos e terminologia consistente.
- Hierarquia clara entre título da página, título de seção, número principal, rótulo e metadado.
- Evitar títulos quebrados, números cortados, placeholders como único rótulo e fontes minúsculas para caber conteúdo.
- Usar “Última atualização”, “Sem dados”, “Em configuração”, “Vaga indisponível” e “Placa sem resposta” conforme o contexto.
- Exibir unidade e período junto da métrica; porcentagem sem período/recorte não é suficiente.
- Não chamar indisponibilidade de “vazio” nem taxa sem denominador de “0%”.

## 5. Componentes e estados

| Componente | Regra |
| --- | --- |
| Botão principal | Ação prioritária evidente, com contraste adequado e estados de foco/carregamento. |
| Botão secundário | Menor peso visual, mantendo leitura e área de interação. |
| Campo | Rótulo persistente, ajuda quando necessária e erro próximo do campo. |
| Criação de senha | Olho independente por campo, requisitos atualizados em tempo real, confirmação explícita e erro junto ao campo responsável. |
| Card de indicador | Título, valor, unidade/recorte e indicação de indisponibilidade. |
| Tabela/lista | Cabeçalhos claros, filtros visíveis, linha selecionada e alternativas em telas menores. |
| Modal | Título, ação clara, foco administrado e comportamento previsível. |
| Notificação de desfazer | Mensagem específica, ação de desfazer e alternativa posterior de reativação pelo Admin. |
| Estado vazio | Explicação do motivo e próxima ação possível, sem números inventados. |
| Erro de conexão | Explicar perda de atualização, permitir recuperação sem esconder dados expirados. |

Estados a conferir em cada componente: padrão, passagem do mouse quando aplicável, foco, pressionado ou selecionado, desabilitado, carregando, vazio, erro, sucesso e dados desatualizados. Usar padrões existentes e evitar uma janela diferente para cada tela.

Cards acionáveis usam uma resposta curta de elevação e pressão, sem animações decorativas longas. O contorno da palavra “vagas” no login se desenha como rabisco ao carregar.

Na troca obrigatória de senha, não depender da mensagem nativa do navegador. Informar separadamente senha provisória incorreta, senha repetida, requisito ausente e confirmação divergente. Cor e ícone podem reforçar o estado de cada requisito, mas o texto continua sendo a fonte da informação.

## 6. Layout por área

### Landing page

Manter a identidade do site aprovado e o CTA de WhatsApp. Explicar o serviço e as funcionalidades com clareza. Acesso ao login é distinto do contato comercial. Não incluir formulário público de cadastro do gerente nem transformar o fluxo em checkout. Layouts e animações devem favorecer leitura e navegação.

### Painel do gerente

Navegação consistente, indicadores, seletor de andar, mapa, filtros e detalhe de vaga. Deixar visível se os dados se referem ao shopping inteiro ou ao andar. Análises e exportações ficam acessíveis sem competir com a leitura operacional. O modo “em configuração” explica a ausência de leituras.

### Painel Admin

Reutilizar a base visual, mas oferecer organização para shoppings, acessos e equipamentos. Situação de comunicação deve mostrar evidências: última resposta, tempo sem contato e sensores afetados. Evitar um círculo “saúde 100%” sem cálculo confiável. Manutenção manual e comunicação atual são informações separadas.

### Mapa

- Uma representação por andar, com proporção preservada.
- Vagas associadas a IDs reais, com código, tipo e estado distinguíveis.
- Mudanças de estado não deslocam nem redimensionam a vaga.
- Seleção/foco deve ser distinguível da cor de ocupação.
- Ao trocar de andar, atualizar mapa, filtros e recorte de indicadores de maneira coerente.
- Busca por vaga de outro andar deve navegar ao andar correto e destacar a vaga.
- No celular, permitir navegação/zoom adequados sem reduzir tudo a elementos ilegíveis; oferecer lista acessível complementar.
- Texto, ícone ou padrão complementam as cores. Legenda deve explicar os estados.

### Telões

- Tela de entrada: vagas livres por andar. Tela de andar: vagas livres por setor.
- Destaques: PCD, idosos e elétricas, além do total. Sem motos.
- Números grandes, contraste e distância de leitura orientam o layout.
- Categorias especiais são parte do total; não montar uma apresentação que sugira somá-las novamente.
- Sem sidebar administrativa, formulários ou detalhes técnicos de manutenção.
- Dados expirados exigem aviso visível e contagem não apresentada como disponibilidade atual.

## 7. Responsividade e acessibilidade

Adotar layout fluido e larguras de tela adequadas ao conteúdo, conciliadas com os desenhos existentes. Como **matriz de verificação proposta**, testar aproximadamente 360, 768, 1280 e 1920 pixels, além da resolução real do telão. Esses números não foram extraídos do Figma.

Conferir navegação por teclado, foco visível, leitura dos controles por tecnologia assistiva, zoom do navegador, textos maiores e áreas de toque. A interface atual respeita a preferência do usuário por menos movimento. Nenhuma informação essencial depende apenas de passagem do mouse, animação ou cor.

Verificar contraste de texto/controles usando os valores reais; não declarar conformidade completa de acessibilidade sem auditoria. Scroll horizontal interno pode ser necessário no mapa; não deve fazer a página inteira escapar da tela.

## 8. Bibliotecas, imagens e assets

Aceternity UI e Font Awesome foram adotados como referências. Selecionar apenas o que ajuda a interface, respeitando licença e dependências. Não instalar conjuntos redundantes de ícones. Preferir componentes e ícones já existentes que correspondam visualmente ao design.

Se um asset exato vier do Figma, preservar o desenho e dar nome descritivo em português. Baixar assets necessários ao código durável conforme permissões e registrar a origem; não depender de URL temporária. Logos, plantas e ícones não devem ser recriados por aproximação quando o original estiver disponível.

## 9. Referência para novas alterações visuais

1. Usar o site aprovado em 16/10/2026 e os tokens existentes como base.
2. Preservar marca, proporções, padrões de componentes e melhorias aprovadas.
3. Documentar a origem de novos assets e decisões. Consultar o Figma como referência inicial quando necessário.
4. Conferir a página renderizada, responsividade, contraste, foco e navegação por teclado.
5. Registrar evidências técnicas sem apresentar a aprovação visual interna como auditoria completa de acessibilidade ou validação de integrações.

## 10. Aceite visual

**Aprovação visual em 16/10/2026:** site atual aprovado como evolução da proposta inicial do Figma. A pendência de aprovação visual está encerrada. Os itens técnicos abaixo permanecem uma lista de verificação, sem presumir execução completa, implementação de telões ou conformidade integral de acessibilidade.

### Revisão da seção Sobre — 09/09/2026

A seção usa como referência complementar os arquivos `Group 132.png` e `Group 132.svg`: apresentação com anéis ao redor da marca, quatro etapas com círculos amarelos e notebook conectado aos benefícios. O componente `sobre-vaggu.tsx` reutiliza Poppins, `--primary` e as imagens existentes. As linhas aparecem ao entrar na tela, com disposição vertical no celular; quando o usuário prefere menos movimento, a apresentação reduz ou remove a animação decorativa.

Os textos foram ajustados ao escopo de estacionamento: “Eventos estratégicos” e “Gestão de público” passam a “Planejamento da operação” e “Visão da ocupação”. Por decisão interna, a legenda visível do notebook e o controle manual de pausa foram removidos; o notebook mantém descrição alternativa de ilustração. As conexões aguardam a maior parte do painel entrar na área visível da tela antes de iniciar. Naquele registro, medidas exatas e componentes do Figma estavam pendentes de confirmação. A aprovação do site em 16/10 encerrou essa exigência de fidelidade ao protótipo. Esta revisão da apresentação não comprova implementação das integrações anunciadas.

Refinamento definido em 09/09: reduzir a escala e o peso da seção para acompanhar o restante da landing. Títulos usam peso 400, textos de apoio 300 e círculos das etapas têm até 136 px. Rótulos do diagrama são posicionados pelo raio dos anéis; pontos luminosos percorrem as órbitas quando o movimento está habilitado. Nenhuma informação essencial depende do movimento. Referências: [Orbiting Circles](https://magicui.design/docs/components/orbiting-circles), [Moving Border](https://ui.aceternity.com/components/moving-border) e [Motion](https://motion.dev/). Implementação própria com CSS e Motion já instalado, sem adicionar bibliotecas.

A seção seguinte, `operacao-vaggu.tsx`, preserva a foto urbana e apresenta um título, explicação, benefícios de planejamento/implantação e contato pelo WhatsApp. Substitui os dois cards no rodapé de uma área alta por conteúdo alinhado à imagem; no celular, a imagem precede o texto. Essas mudanças seguem a decisão de revisão registrada, não uma nova extração de medidas do Figma.

- [ ] Logo e paleta da VAGGU preservadas.
- [ ] Fontes e medidas conferidas ou pendências declaradas.
- [ ] Nenhum texto cortado, ícone desalinhado ou elemento sobreposto.
- [ ] Componentes e fundos de ícones consistentes.
- [ ] Estados vazios, de erro e de configuração desenhados.
- [ ] Mapa legível e navegável em mais de um andar.
- [ ] Telões com categorias corretas e sem dupla contagem.
- [ ] Responsividade, foco e uso por teclado verificados.
- [ ] Comparação visual registrada, sem afirmar extração que não ocorreu.

### Visual do telão — 21/10/2026

Telão: preservar logo oficial, Poppins, fundo preto, total amarelo e categorias identificadas por ícones/texto. Mostrar somente shopping, visão geral/andar, vagas livres por área e categorias. Remover horários, avisos de dados parciais e explicações técnicas da apresentação; manter “—” quando a contagem não estiver confirmada. Layout na altura da janela, sem rolagem; áreas excedentes alternam em páginas automaticamente. Oferecer tela cheia com Esc, com controles discretos e foco visível. A gestão em `/painel/teloes` mantém configuração e mensagens operacionais fora da apresentação. Ver [evidências do protótipo](telao-apresentacao-2026-10-21.md).
