# VAGGU — MVP Frontend

Protótipo navegável do sistema de gestão de estacionamentos da VAGGU, construído em React, TypeScript e Tailwind CSS.

## Escopo deste MVP

- Landing page institucional com contato exclusivamente pelo WhatsApp.
- Login com perfis demonstrativos de Admin VAGGU e Shopping.
- Área administrativa para cadastrar um shopping e gerar o seu acesso temporário.
- Painel do shopping com dados somente para consulta.
- Insights e indicadores bloqueados enquanto os sensores reais não estiverem conectados.
- Dados do shopping e das vagas tratados diretamente com a equipe VAGGU pelo WhatsApp.

Este repositório não possui backend. Os dados da demonstração ficam no `localStorage` do navegador. A autenticação local e o hash de senha existem apenas para simular o fluxo; não devem ser usados em produção. Um acesso criado pelo Admin funciona somente no mesmo navegador em que foi gerado.

## Como executar

```bash
cd front-end
npm install
npm run dev
```

Verificações disponíveis:

```bash
npm run lint
npm run build
```

## Acessos da demonstração

- Admin VAGGU: `admin@vaggu.com`
- Shopping: `shopping@vaggu.com`

As senhas de demonstração também aparecem na tela de login.

## Configuração antes de publicar

Troque o número de WhatsApp presente em `src/lib/constants.ts` pelo número oficial da VAGGU. Em uma próxima etapa, substitua o armazenamento e a autenticação locais por uma API segura e um banco de dados.
