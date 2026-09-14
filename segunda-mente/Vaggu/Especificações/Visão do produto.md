# Visão do produto

Consolidação em 11/09/2026 a partir do SSD local e das decisões recentes de Pietro nas conversas recuperadas.

## Decisões atuais

- Sistema web responsivo para computador, tablet e celular.
- Landing apresenta o serviço e leva ao WhatsApp; equipe conduz reunião e parceria.
- Admin VAGGU configura o shopping e cria contas individuais para um ou mais gerentes.
- Gerente consulta apenas seu shopping e altera somente os próprios dados permitidos e senha.
- Mapa operacional com navegação entre andares, filtros e seleção de vagas.
- Hierarquia: shopping → andar → setor → vaga.
- Tipos de vaga: comum, PCD, idoso e elétrica.
- Estados: livre, ocupada e indisponível. Falta de leitura confiável não significa vaga livre.
- Admin acompanha placas ESP32, sensores, comunicação e manutenção.
- Telões mostram disponibilidade por andar/setor, sem contar categorias especiais duas vezes.
- Histórico alimenta métricas, exportações e Power BI; preservar isolamento por shopping.
- Sem cadastro público de gerente, aplicativo nativo, motos, lotes comerciais, reservas, pagamentos ou reconhecimento de veículos.
- WhatsApp pode ter fluxo funcional de menu e encaminhamento; chatbot de IA não faz parte do MVP.

## Decisões antigas substituídas

As conversas antigas mencionam um gerente por shopping e cadastro/configuração pelo próprio gerente. As instruções de 09/09 e o SSD atual substituem isso por múltiplos gerentes e administração pela equipe VAGGU.

Tempos de confirmação também variam no histórico: há menção antiga a um minuto; o planejamento técnico atual prevê 30 segundos, com evidência consistente. Consultar o SSD para timeout e demais regras antes de implementar.

## Implementação e proposta

O frontend usa autenticação, gestão administrativa, Minha conta e mapa integrados à API. A troca obrigatória aplica uma política explícita de senha na interface e no backend. Importação, telemetria, telões integrados e Power BI continuam pendentes.

Detalhes e contratos: [[SSD-VAGGU]]]. Critérios:[[plano-e-aceite]]]].
