// Cria somente os registros de um piloto novo, sem alterar equipamentos ou credenciais existentes.
import { randomBytes } from 'node:crypto';
import type { PrismaClient } from '@prisma/client';
import { hashPassword } from '../auth/password.js';

export async function criarPilotoEsp32(prisma: PrismaClient) {
  const codigo = 'VAGGU_ESP32_PILOTO_01';
  const email = 'piloto.esp32@vaggu.local';
  const chave = randomBytes(32).toString('base64url');
  const senhaProvisoria = `Piloto!9a${randomBytes(18).toString('base64url')}`;
  const [chaveApiHash, senhaHash] = await Promise.all([hashPassword(chave), hashPassword(senhaProvisoria)]);
  const shoppingId = await prisma.$transaction(async tx => {
    if (await tx.dispositivo.findUnique({ where: { codigo } }) || await tx.usuario.findUnique({ where: { email } })) {
      throw new Error('Piloto já existe; nenhum acesso ou chave foi redefinido.');
    }
    const shopping = await tx.shopping.create({ data: { nome: 'Piloto físico ESP32 — 3 vagas', demonstracao: false, situacaoImplantacao: 'ATIVO' } });
    const andar = await tx.andar.create({ data: { shoppingId: shopping.id, nome: 'Protótipo físico', ordem: 0 } });
    const setor = await tx.setor.create({ data: { shoppingId: shopping.id, andarId: andar.id, nome: 'Piloto ESP32' } });
    const placa = await tx.dispositivo.create({ data: { shoppingId: shopping.id, codigo, nome: 'Piloto HTTPS ESP32', chaveApiHash } });
    for (let i = 1; i <= 3; i++) {
      const sensorCodigo = `${codigo}-S0${i}`;
      const vaga = await tx.vaga.create({ data: {
        shoppingId: shopping.id, andarId: andar.id, setorId: setor.id, dispositivoId: placa.id,
        codigo: `P0${i}`, canalSensor: sensorCodigo, estadoAtual: 'INDISPONIVEL',
        posicaoX: 0.12 + (i - 1) * 0.27, posicaoY: 0.3, largura: 0.18, altura: 0.3, rotacao: 0,
      } });
      await tx.sensor.create({ data: { shoppingId: shopping.id, dispositivoId: placa.id, vagaId: vaga.id, codigo: sensorCodigo } });
    }
    await tx.usuario.create({ data: {
      shoppingId: shopping.id, nome: 'Operador do piloto ESP32', email, senhaHash,
      perfil: 'SHOPPING', trocarSenhaObrigatoria: true,
    } });
    return shopping.id;
  });
  // Consumidor CLI grava em arquivo local; nunca enviar este objeto às telas de listagem.
  return { shoppingId, codigo, chave, email, senhaProvisoria };
}
