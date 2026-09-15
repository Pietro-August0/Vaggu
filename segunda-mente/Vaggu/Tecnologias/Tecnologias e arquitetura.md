# Tecnologias e arquitetura

Fonte: `package.json` dos dois pacotes e código versionado, conferidos em 15/09/2026. As versões abaixo são declarações dos manifests, não auditoria das dependências instaladas.

| Camada | Base existente |
| --- | --- |
| Frontend | React ^19.2.8, Vite ^8.2.2, TypeScript, Tailwind ^4.3.3 |
| Navegação | React Router ^7.18.3 |
| Componentes | Radix UI, shadcn, Lucide, Motion |
| Tipografia | Poppins e Geist Variable presentes |
| Backend | Node.js >=22.12.0 e <25, Express ^5.1.0, TypeScript |
| Persistência | PostgreSQL, Prisma 7.10.0, adaptador pg |
| Segurança | Sessões opacas, hash de senhas, Helmet |
| Integração existente | Webhook WhatsApp Cloud API |
| Importação em andamento | CSV nativo e XLSX com `read-excel-file`; prévias persistidas em JSONB |
| Qualidade | ESLint, compilação TypeScript, Node Test Runner e Supertest |
| Hardware planejado | ESP32, sensores ultrassônicos, Wi-Fi |
| Análises planejadas | Power BI com histórico real e isolamento de acesso |

Frontend declara TypeScript ^6.0.3; backend declara ^7.0.2. Não houve atualização de dependências nesta sessão.

A senha definitiva é validada na API e na interface: 12–128 caracteres, minúscula, maiúscula, número, símbolo, sem espaços e diferente da senha atual. O frontend mostra o estado de cada requisito e erros por campo; o backend devolve códigos de domínio específicos e continua armazenando somente o hash scrypt.

## Fluxo pretendido

ESP32 → API valida leituras → PostgreSQL guarda estado/histórico → atualização dos painéis e telões → análises.

## Estrutura entregue em P04 e prévias do P05

O PostgreSQL representa `Shopping → Andar → Setor → Vaga`. A vaga possui categoria `COMUM`, `PCD`, `IDOSO` ou `ELETRICA` e posição proporcional no mapa. Cada andar usa uma revisão para impedir que duas edições sobrescrevam silenciosamente o mesmo desenho. O gerente consulta somente a estrutura derivada da própria sessão. O P05 acrescentou prévias CSV/XLSX validadas por linha, armazenadas por shopping sem modificar a estrutura; a confirmação ainda não existe.

Sensores e telões continuam planejados para P06 e P07. Ver [[Vaggu/Documentação/arquitetura-estrutura-sensores-telao]].

Socket.IO aparece como proposta em conversa anterior. Não consta nas dependências atuais; o transporte de tempo real deve ser confirmado na entrega correspondente.

## Estado verificado no histórico

P04 registra 52 testes aprovados com PostgreSQL real em 12/09, além de lint, build e fluxo no navegador. Isso valida estrutura e mapa; não comprova hardware, telemetria ou telões.

O PostgreSQL portátil de desenvolvimento permanece disponível em `127.0.0.1:55432`; credenciais continuam somente nos arquivos locais ignorados pelo Git.

Ver [[Vaggu/Documentação/configuracao|configuração]] e [[Vaggu/Planejamento/Próximos passos]].
