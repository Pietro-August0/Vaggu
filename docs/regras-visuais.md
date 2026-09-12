# VAGGU — regras visuais permanentes

Versão 1.0 • 09/09/2026

## 1. Referência e grau de confirmação

Referência principal: [Figma VAGGU — página Web](https://www.figma.com/design/xKI9wjoiZ5CoXC3DXIJNmq/Vaggu?node-id=2022-2).

- Arquivo: `xKI9wjoiZ5CoXC3DXIJNmq`.
- Nó indicado: `2022:2`.
- A referência já consultada na conversa e o documento mestre sustentam a direção visual: amarelo, tons escuros, textos claros, marca VAGGU e interface minimalista.
- Em 09/09, a nova consulta à integração foi bloqueada por limite de chamadas. Não foi possível extrair novamente cores numéricas, fontes, espaçamentos e componentes deste nó.
- As regras abaixo distinguem **identidade conhecida**, **regras de implementação** e **tokens a conferir**. Não há paleta hexadecimal nem família tipográfica inventada neste pacote.
- Frames podem preservar escopo antigo, como motos. As decisões atuais de produto prevalecem; o estilo visual continua sendo a referência.

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

Não importar paletas ou logos de outros projetos do usuário. Não transformar a aplicação em um dashboard genérico com gradientes, efeitos e cores sem relação com o Figma. A biblioteca de componentes deve se adaptar à VAGGU.

## 3. Registro de tokens a completar

Antes de introduzir valores novos, localizar os tokens no repositório e compará-los ao Figma. Registrar valor, origem, nó, modo e data. Até essa conferência, preservar o que já está implementado e marcar divergências.

| Token semântico sugerido | Função | Valor exato |
| --- | --- | --- |
| `--cor-marca-primaria` | Amarelo principal | Pendente de extração |
| `--cor-fundo-principal` | Fundo da aplicação | Pendente de extração |
| `--cor-superficie` | Cards e áreas elevadas | Pendente de extração |
| `--cor-texto-principal` | Texto de maior contraste | Pendente de extração |
| `--cor-texto-secundario` | Metadados e apoio | Pendente de extração |
| `--cor-borda` | Separação de elementos | Pendente de extração |
| `--cor-foco` | Foco de teclado | Pendente de conferência de contraste |
| `--fonte-principal` | Texto e controles | Família/pesos pendentes |
| `--fonte-destaque` | Títulos, caso exista distinta | Pendente; não assumir que há duas fontes |
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
| Card de indicador | Título, valor, unidade/recorte e indicação de indisponibilidade. |
| Tabela/lista | Cabeçalhos claros, filtros visíveis, linha selecionada e alternativas em telas menores. |
| Modal | Título, ação clara, foco administrado e comportamento previsível. |
| Notificação de desfazer | Mensagem específica, ação de desfazer e alternativa posterior de reativação pelo Admin. |
| Estado vazio | Explicação do motivo e próxima ação possível, sem números inventados. |
| Erro de conexão | Explicar perda de atualização, permitir recuperação sem esconder dados expirados. |

Estados a implementar: padrão, hover onde aplicável, foco, pressionado/selecionado, desabilitado, carregando, vazio, erro, sucesso e dados desatualizados. Usar padrões existentes e evitar uma versão diferente de modal para cada tela.

## 6. Layout por área

### Landing page

Manter a identidade da apresentação do Figma e o CTA de WhatsApp. Explicar o serviço e as funcionalidades com clareza. Acesso ao login é distinto do contato comercial. Não incluir formulário público de cadastro do gerente nem transformar o fluxo em checkout. Layouts e animações devem favorecer leitura e navegação.

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

Adotar layout fluido e breakpoints necessários ao conteúdo, conciliados com os frames existentes. Como **matriz de verificação proposta**, testar aproximadamente 360, 768, 1280 e 1920 pixels, além da resolução real do telão. Esses números não foram extraídos do Figma.

Conferir navegação por teclado, foco visível, leitura dos controles por tecnologia assistiva, zoom do navegador, textos maiores e áreas de toque. Respeitar preferência por movimento reduzido. Nenhuma informação essencial depende apenas de hover, animação ou cor.

Verificar contraste de texto/controles usando os valores reais; não declarar conformidade completa de acessibilidade sem auditoria. Scroll horizontal interno pode ser necessário no mapa; não deve fazer a página inteira escapar da tela.

## 8. Bibliotecas, imagens e assets

Aceternity UI e Font Awesome foram indicados pela equipe como referências. Selecionar apenas o que ajuda a interface, respeitando licença e dependências. Não instalar conjuntos redundantes de ícones. Preferir componentes e ícones já existentes que correspondam visualmente ao design.

Se um asset exato vier do Figma, preservar o desenho e dar nome descritivo em português. Baixar assets necessários ao código durável conforme permissões e registrar a origem; não depender de URL temporária. Logos, plantas e ícones não devem ser recriados por aproximação quando o original estiver disponível.

## 9. Procedimento para confirmar a identidade

1. Localizar o nó da tela e ler o contexto de design com a skill de Figma disponível.
2. Obter/revisar sua captura e os componentes associados.
3. Inventariar tokens, fontes, assets, variantes e espaçamentos reais.
4. Comparar com o repositório e reutilizar o que corresponde.
5. Registrar divergências do escopo antigo, aplicando as decisões atuais.
6. Implementar e comparar a página renderizada em tamanho equivalente, conferindo também versões menores.
7. Preencher o registro de tokens com evidência e data. Se faltar acesso, manter a pendência explícita.

## 10. Aceite visual

### Revisão da seção Sobre — 09/09/2026

A seção usa como referência complementar os arquivos `Group 132.png` e `Group 132.svg` enviados pela equipe: apresentação com anéis ao redor da marca, quatro etapas com círculos amarelos e notebook conectado aos benefícios. O componente `sobre-vaggu.tsx` reutiliza Poppins, `--primary` e os assets existentes. As linhas aparecem ao entrar na tela, com disposição vertical no celular e respeito a movimento reduzido.

Os textos foram ajustados ao escopo de estacionamento: “Eventos estratégicos” e “Gestão de público” passam a “Planejamento da operação” e “Visão da ocupação”. A pedido da equipe, a legenda visível do notebook e o texto do controle de pausa foram removidos; o notebook mantém descrição alternativa de ilustração e o botão por ícone mantém nome acessível. A consulta ao contexto do nó `2022:2` retornou erro de seleção; medidas exatas e tokens do Figma continuam pendentes de confirmação. Esta revisão da apresentação não comprova implementação das integrações anunciadas.

Refinamento solicitado pela equipe em 09/09: reduzir a escala e o peso da seção para acompanhar o restante da landing. Títulos usam peso 400, textos de apoio 300 e círculos das etapas têm até 136 px. Rótulos do diagrama são posicionados pelo raio dos anéis; pontos luminosos percorrem as órbitas, pausam fora da tela e oferecem controle de pausa e movimento reduzido. Referências de movimento: [Orbiting Circles](https://magicui.design/docs/components/orbiting-circles), [Moving Border](https://ui.aceternity.com/components/moving-border) e [Motion — movimento reduzido](https://motion.dev/docs/react-use-reduced-motion). Implementação própria com CSS e Motion já instalado, sem adicionar bibliotecas.

A seção seguinte, `operacao-vaggu.tsx`, preserva a foto urbana e apresenta um título, explicação, benefícios de planejamento/implantação e contato pelo WhatsApp. Substitui os dois cards no rodapé de uma área alta por conteúdo alinhado à imagem; no celular, a imagem precede o texto. Essas mudanças seguem a correção explícita da equipe, não uma nova extração de medidas do Figma.

- [ ] Logo e paleta da VAGGU preservadas.
- [ ] Fontes e medidas conferidas ou pendências declaradas.
- [ ] Nenhum texto cortado, ícone desalinhado ou elemento sobreposto.
- [ ] Componentes e fundos de ícones consistentes.
- [ ] Estados vazios, de erro e de configuração desenhados.
- [ ] Mapa legível e navegável em mais de um andar.
- [ ] Telões com categorias corretas e sem dupla contagem.
- [ ] Responsividade, foco e uso por teclado verificados.
- [ ] Comparação visual registrada, sem afirmar extração que não ocorreu.
