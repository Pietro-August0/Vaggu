// Prepara exclusivamente o shopping de bancada e grava segredos em arquivos locais ignorados.
import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createPrisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/auth/password.js';

const codigo = 'VAGGU_ESP32_BANCADA_01';
const email = 'bancada.esp32@vaggu.local';
const pasta = resolve('../hardware/esp32-3-vagas/vaggu_3_vagas');
const configPath = resolve(pasta, 'config.h');
const acessoPath = resolve('../hardware/esp32-3-vagas/acesso.local');
const apiBase = process.env.BANCADA_API_BASE ?? 'http://192.168.1.100:3000/api/v1/telemetria';
const destino = new URL(apiBase);
if (destino.protocol !== 'http:' || destino.pathname !== '/api/v1/telemetria') {
  throw new Error('BANCADA_API_BASE deve ser a URL HTTP local terminada em /api/v1/telemetria.');
}
const prisma = createPrisma();
try {
  const existente = await prisma.dispositivo.findUnique({ where: { codigo }, include: { sensores: true, shopping: true } });
  if (existente) {
    if (existente.shopping.nome !== 'Bancada ESP32 — 3 vagas' || existente.shopping.demonstracao || existente.sensores.length !== 3
      || !existsSync(configPath) || !readFileSync(configPath, 'utf8').includes(codigo) || !existsSync(acessoPath)) {
      throw new Error('Bancada existente divergente ou configuração local ausente. Não foi alterada nenhuma chave.');
    }
    console.log('Bancada já preparada; configuração e credenciais preservadas.');
  } else {
    if (existsSync(configPath) || existsSync(acessoPath)) throw new Error('Há configuração local existente. Nenhum arquivo ou chave foi sobrescrito.');
    const chave = randomBytes(32).toString('base64url');
    const senha = `Bancada!9a${randomBytes(15).toString('base64url')}`;
    const [chaveApiHash, senhaHash] = await Promise.all([hashPassword(chave), hashPassword(senha)]);
    const resultado = await prisma.$transaction(async tx => {
      if (await tx.usuario.findUnique({ where: { email } })) throw new Error('E-mail de bancada já existe; acesso preservado.');
      const shopping = await tx.shopping.create({ data: { nome: 'Bancada ESP32 — 3 vagas', demonstracao: false, situacaoImplantacao: 'ATIVO' } });
      const andar = await tx.andar.create({ data: { shoppingId: shopping.id, nome: 'Protótipo físico', ordem: 0 } });
      const setor = await tx.setor.create({ data: { shoppingId: shopping.id, andarId: andar.id, nome: 'Bancada' } });
      const dispositivo = await tx.dispositivo.create({ data: { shoppingId: shopping.id, codigo, nome: 'ESP32 física de três vagas', chaveApiHash } });
      for (let i = 0; i < 3; i++) {
        const sensorCodigo = `${codigo}-S0${i + 1}`;
        const vaga = await tx.vaga.create({ data: {
          shoppingId: shopping.id, andarId: andar.id, setorId: setor.id, dispositivoId: dispositivo.id,
          codigo: `A0${i + 1}`, canalSensor: sensorCodigo, estadoAtual: 'INDISPONIVEL',
          posicaoX: 0.12 + i * 0.27, posicaoY: 0.3, largura: 0.18, altura: 0.3, rotacao: 0,
        } });
        await tx.sensor.create({ data: { shoppingId: shopping.id, dispositivoId: dispositivo.id, vagaId: vaga.id, codigo: sensorCodigo } });
      }
      await tx.usuario.create({ data: { shoppingId: shopping.id, nome: 'Operador da bancada ESP32', email, senhaHash, perfil: 'SHOPPING', trocarSenhaObrigatoria: true } });
      return shopping;
    });
    const linha = (nome: string, valor: string) => `const char* ${nome} = ${JSON.stringify(valor)};`;
    writeFileSync(configPath, ['#pragma once', '// Arquivo local: não compartilhe nem versione.',
      '#define VAGGU_PERMITIR_HTTP_LOCAL 1', linha('WIFI_SSID', 'PREENCHER_WIFI_2G4'), linha('WIFI_SENHA', 'PREENCHER_SENHA_LOCALMENTE'),
      linha('API_BASE', apiBase), linha('PLACA_CODIGO', codigo), linha('PLACA_CHAVE', chave), ''].join('\n'));
    writeFileSync(acessoPath, `Bancada local ESP32\nShopping: ${resultado.nome}\nID: ${resultado.id}\nE-mail: ${email}\nSenha provisória: ${senha}\nTroque a senha no primeiro acesso. Não compartilhe este arquivo.\n`);
    console.log('Shopping de bancada, três vagas, placa, sensores e gerente criados.');
  }
  console.log('Firmware: hardware/esp32-3-vagas/vaggu_3_vagas/config.h (editar Wi-Fi e IP).');
  console.log('Acesso do gerente: hardware/esp32-3-vagas/acesso.local (senha somente no arquivo).');
} finally {
  await prisma.$disconnect();
}
