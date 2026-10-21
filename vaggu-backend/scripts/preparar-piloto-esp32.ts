// Executar em ambiente local com conexão explicitamente selecionada ao banco hospedado.
// Não expõe credenciais em stdout nem cria endpoints públicos de provisionamento.
import 'dotenv/config';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createPrisma } from '../src/lib/prisma.js';
import { criarPilotoEsp32 } from '../src/telemetria/piloto.js';

const api = new URL(process.env.PILOTO_API_BASE ?? 'https://vaggu-tcc.onrender.com/api/v1/telemetria');
if (api.protocol !== 'https:' || api.username || api.password || api.search || api.hash || api.pathname !== '/api/v1/telemetria') {
  throw new Error('PILOTO_API_BASE deve ser uma URL HTTPS sem credenciais, query ou fragmento, terminada em /api/v1/telemetria.');
}
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL do destino deve ser configurada localmente.');
const banco = new URL(process.env.DATABASE_URL);
if (!['postgres:', 'postgresql:'].includes(banco.protocol)
  || !process.env.PILOTO_CONFIRMAR_HOST_BANCO || banco.hostname !== process.env.PILOTO_CONFIRMAR_HOST_BANCO) {
  throw new Error('Defina PILOTO_CONFIRMAR_HOST_BANCO igual ao hostname do banco selecionado. Nenhum dado foi criado.');
}
const pasta = resolve('../hardware/esp32-3-vagas/piloto.local');
if (existsSync(pasta)) throw new Error('A pasta piloto.local já existe; não será sobrescrita. Confira o resultado da execução anterior.');
mkdirSync(pasta);
const prisma = createPrisma();
try {
  const piloto = await criarPilotoEsp32(prisma);
  const linha = (nome: string, valor: string) => `const char* ${nome} = ${JSON.stringify(valor)};`;
  writeFileSync(resolve(pasta, 'config.h'), ['#pragma once', '#define VAGGU_PERMITIR_HTTP_LOCAL 0',
    '// Configuração privada do piloto. Preencha Wi-Fi localmente. Não versione.',
    linha('WIFI_SSID', 'PREENCHER_WIFI_2G4'), linha('WIFI_SENHA', 'PREENCHER_SENHA_LOCALMENTE'),
    linha('API_BASE', api.href), linha('PLACA_CODIGO', piloto.codigo), linha('PLACA_CHAVE', piloto.chave), ''].join('\n'), { flag: 'wx' });
  writeFileSync(resolve(pasta, 'acesso.local'), `Piloto hospedado ESP32\nShopping ID: ${piloto.shoppingId}\nE-mail: ${piloto.email}\nSenha provisória: ${piloto.senhaProvisoria}\nTroque no primeiro acesso. Não compartilhe.\n`, { flag: 'wx' });
  console.log('Piloto criado: shopping próprio, P01/P02/P03, sensores, chave individual e gerente.');
  console.log('Arquivos privados: hardware/esp32-3-vagas/piloto.local/config.h e acesso.local.');
  console.log('Configuração de bancada preservada. Revise o destino antes de copiar e gravar o firmware.');
} finally {
  await prisma.$disconnect();
}
