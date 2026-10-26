# Animações das análises — 25/10/2026

Experimento local na branch `codex/animacoes-analises`, a partir da main integrada. Pedido: testar entradas dos gráficos e contagens crescentes, preservando os dados e as correções de carregamento. Ainda sem publicação ou aprovação visual atribuída.

## Comportamento implementado

- Contagens de categorias, indicadores, centros/legendas das roscas e cobertura crescem ao entrar na viewport. Duração de 0,85 s, desaceleração suave, sem mudança da largura do número.
- Mudanças de valor usam a posição visual atual como início; podem aumentar ou diminuir. Atualizações de comparação, foco e renderizações sem mudança do valor não são gatilhos de reinício.
- Linha e área surgem da esquerda para a direita em 1 s, por recorte SVG; lacunas continuam separadas. A revelação usa um recorte para evitar o efeito tracejado observado no primeiro ensaio com stroke-dasharray e vector-effect.
- Barras de movimento crescem a partir da base em 0,7 s; barras de cobertura crescem a partir da esquerda em 0,8 s. Roscas entram com opacidade e escala suaves em 0,65 s.
- Dados ausentes aparecem diretamente como ausência; não são convertidos em zero. Gráficos e exportações recebem os valores confirmados, não os passos da contagem.
- Leitores de tela recebem o número final desde o início; os passos visuais não são anunciados. A largura do texto final fica reservada para evitar deslocamentos.
- Movimento reduzido mostra os valores finais e os gráficos completos. Alterar a preferência com a página aberta interrompe visualmente o movimento; contagens cancelam sua animação. O hook da versão instalada do Motion não atualizava essa preferência em tempo real; usamos uma assinatura nativa de matchMedia via useSyncExternalStore.

## Validação local

Rota `/painel/analise`, gerente fictício do Shopping Exemplo, frontend `http://127.0.0.1:5173`. Playwright/Edge headless, com respostas de API fictícias interceptadas. Browser plugin ausente; utilizado Playwright. Não valida banco, autorização do servidor, sensores, produção ou desempenho em aparelhos físicos.

- Build/lint aprovados, com aviso conhecido de chunks maiores que 500 kB.
- Regressão aprovada: primeira carga, comparação lenta, manutenção da última consulta ao atualizar, filtros, falhas/recuperação, resposta antiga descartada, sem histórico, período de 31 dias e downloads Excel/PDF.
- Desktop 1440×1000, tablet 768×1024 e celular 390×844 nos dois temas, com preferência de movimento reduzido: sem overflow da página ou erro JavaScript inesperado.
- Movimento normal: amostra intermediária de 8 em direção a 24; valor acessível já em 24, largura constante, término em 24. Contagem de volta após filtro e interrupção por preferência reduzida conferidas. Ausência de histórico manteve travessão/Sem observação.
- Interação por teclado em pontos e barras conferida. Revelação SVG e crescimento das barras conferidos em quadros intermediários e finais.
- Prévia animada: 13 quadros de um recorte 1160×950 da viewport desktop, em passos controlados de 100 ms via relógio do Playwright e pausa final de 900 ms. GIF criado com Pillow, usando somente capturas do navegador. O GIF repete para facilitar comparação; a página não executa esse loop.

Roteiros temporários: `%TEMP%/vaggu-animacoes-regressao.cjs`, `vaggu-animacoes-movimento.cjs` e `vaggu-animacoes-preview.cjs`. A fixture da prévia usa uma sessão fictícia de uma hora, compatível com o relógio controlado. Capturas e [prévia](../Evidências%20visuais/2026-10-25%20-%20Animacoes%20analises/previa-animacoes.gif) no [índice de evidências](../Evidências%20visuais/Índice%20de%20evidências.md).

Comandos finais: `npm run build` e `npm run lint` em vaggu-frontend; roteiros Node/Playwright acima; Python/Pillow para o GIF; `node scripts/verificar-documentacao.mjs` e `git diff --check`. Nenhuma dependência nova. A skill de roteamento VAGGU permanece indisponível conforme buscas anteriores, sem alteração de autoria Git.

## Próxima avaliação

Avaliar o ritmo visual com a equipe antes de publicar e conferir o comportamento no ambiente de destino. Backend, hardware e dados reais permanecem fora deste experimento.
