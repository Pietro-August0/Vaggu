# Entrega de telões, análises e consolidação documental — 17/10/2026

## Alterações consolidadas

- Telões autenticados do gerente: entrada em /painel/telao e setores em /painel/telao/andares/:andarId. Exibição passiva para motoristas, sem botões, links ou campos. Atualização automática a cada 30 segundos; modo kiosk configurado pelo operador do dispositivo.
- Visual baseado na referência visual do projeto: logo oficial, Poppins, preto e amarelo #ffe100; total em destaque, andares/setores centrais e categorias PCD, idoso e elétrica na faixa inferior. Ajustado espaçamento para o rodapé caber em 1920×1080 e 1366×768.
- Contagens de livres exigem monitoramento válido. Falhas ocultam valores antigos; estados ausentes/parciais recebem aviso e o Shopping Exemplo permanece identificado como demonstração. Faixas visuais provisórias: até 20% livres = poucas vagas, até 50% = vagas disponíveis, acima = maior disponibilidade; cobertura parcial recebe estado neutro.
- Análise: rótulo “ocupadas agora” quebrado em duas linhas, limitado ao centro interno da rosca. Novo gráfico de barras horizontais de cobertura por setor à direita de Tipo de vaga no desktop, usando porSetor.coberturaPercentual da API e o período consultado (SSD §10.2). Sem histórico, mostra ausência de medições. A métrica expressa tempo conhecido, não vagas livres.
- Filtro de datas reorganizado: campos ocupam a largura útil, ações junto às datas e orientação de limite/fuso à direita; em telas pequenas, reorganiza em linhas.
- Documentação anterior consolidada: persona Carlos e propostas Mariana/Rafael, aprovação do visual atual como evolução do Figma, roteiro de apresentação no início de dezembro de 2026 (20–25 minutos), navegação breve pelo site/telões, interação WhatsApp e modelos de gráficos Power BI em imagem. Esses registros não comprovam implementação de integrações ou criação de arquivos de slides.
- Sprints: sequência semanal calculada a partir da Sprint 3 de 09/09 a 16/09, mantendo explícita a divergência com o relato de transição da Sprint 5 em 21/10. Ainda precisamos confirmar a numeração.
- Ambiente local: banco isolado vaggu_revisao_local, API 127.0.0.1:3000 e frontend 127.0.0.1:5173. Configurações, senhas e logs permanecem ignorados pelo Git.

## Prints atuais

Origem: navegador local autenticado como gerente de revisão; Shopping Exemplo, dados fictícios. Capturas de 17/10/2026. Não são evidência da publicação remota nem de sensores físicos. Os valores refletem o instante capturado e podem variar.

| Evidência | Resolução | Conteúdo |
| --- | --- | --- |
| [Telão de entrada](../Evidências%20visuais/Teloes%20e%20analises%20-%202026-10-17/telao-entrada-1920.png) | 1920×1080 | Total, andares, categorias, identificação de demonstração e rodapé. |
| [Telão por setor](../Evidências%20visuais/Teloes%20e%20analises%20-%202026-10-17/telao-setores-1920.png) | 1920×1080 | Piso G1 e setores. |
| [Telão compacto](../Evidências%20visuais/Teloes%20e%20analises%20-%202026-10-17/telao-entrada-1366.png) | 1366×768 | Encaixe em monitor menor. |
| [Análise clara](../Evidências%20visuais/Teloes%20e%20analises%20-%202026-10-17/analise-rosca-1440.png) | 1440×1000 | Filtro de datas e texto central da rosca. |
| [Cobertura por setor](../Evidências%20visuais/Teloes%20e%20analises%20-%202026-10-17/analise-cobertura-1440.png) | 1440×1000 | Novo gráfico ao lado de Tipo de vaga. |
| [Filtro escuro](../Evidências%20visuais/Teloes%20e%20analises%20-%202026-10-17/analise-filtro-escuro-1440.png) | 1440×1000 | Campos distribuídos e orientação à direita. |
| [Cobertura no tema escuro](../Evidências%20visuais/Teloes%20e%20analises%20-%202026-10-17/analise-cobertura-escuro-1440.png) | 1440×1000 | Contraste das barras e valores. |
| [Análise móvel](../Evidências%20visuais/Teloes%20e%20analises%20-%202026-10-17/analise-mobile-390.png) | 390×844 | Cabeçalho, ações e filtro responsivo. |

## Conferência e limites

Build TypeScript/Vite e lint executados; validador documental e diff conferidos antes do commit. Conferência visual em navegador com sessão real e API/banco locais. Verificado telão sem elementos interativos e encaixe nas duas resoluções; gráfico de cobertura alinhado ao Tipo de vaga em 1440 px. Não foram executados ensaios com ESP32 físico, WhatsApp real, Power BI conectado ou publicação remota nesta entrega.

P06/P07 continuam parciais: instalação pública com autorização própria, configuração administrativa do recorte, equipamentos e validação de firmware dependem da continuidade do projeto. O dia exato da apresentação e as informações sob responsabilidade da Kamilly permanecem pendentes.


## Correção histórica das sprints — 19/10/2026

As quatro fotografias recebidas em 19/10 substituem a hipótese de calendário semanal usada nos registros anteriores: Sprint 3 em 09–16/09, Sprint 4 em 23–30/09, Sprint 5 em 05–19/10 e Sprint 6 em 19–28/10/2026. Nossa memória situa a Sprint 1 no começo de agosto (brainstorming) e a Sprint 2 na criação da ideia no Figma até a Sprint 3; não há fotografias nem datas exatas dessas duas etapas. Os registros anteriores permanecem como histórico da informação disponível, mas o retrocálculo e a transição antes citada em 21/10 deixaram de ser referência vigente. Datas variáveis, atribuições e fontes estão em [Sprints do projeto](../Planejamento/Sprints%20do%20projeto.md). Planejamento não comprova conclusão técnica e não altera a numeração P01–P11.
