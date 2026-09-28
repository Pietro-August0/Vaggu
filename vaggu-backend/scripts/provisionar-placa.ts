// Provisiona uma placa e seus sensores no banco, exibindo a chave somente nesta execução.
import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { hashPassword } from '../src/auth/password.js';
import { createPrisma } from '../src/lib/prisma.js';

const shoppingId = process.env.PLACA_SHOPPING_ID;
const placaCodigo = process.env.PLACA_CODIGO;
const placaNome = process.env.PLACA_NOME ?? placaCodigo;
const vagasCodigo = process.env.PLACA_VAGAS_CODIGOS?.split(',').map((codigo) => codigo.trim()).filter(Boolean) ?? [];

if (!shoppingId || !placaCodigo || !placaNome || vagasCodigo.length === 0) {
  throw new Error('Informe PLACA_SHOPPING_ID, PLACA_CODIGO e PLACA_VAGAS_CODIGOS.');
}

const prisma = createPrisma();
try {
  const chave = randomBytes(32).toString('base64url');
  const chaveApiHash = await hashPassword(chave);
  const resultado = await prisma.$transaction(async (tx) => {
    const shopping = await tx.shopping.findFirst({ where: { id: shoppingId, excluidoEm: null, ativo: true } });
    if (!shopping) throw new Error('Shopping ativo não encontrado.');
    const existente = await tx.dispositivo.findUnique({ where: { codigo: placaCodigo } });
    if (existente) throw new Error('Já existe uma placa com esse código; a chave não foi alterada.');
    const vagas = await tx.vaga.findMany({
      where: { shoppingId, codigo: { in: vagasCodigo }, ativo: true },
    });
    if (vagas.length !== vagasCodigo.length) throw new Error('Uma ou mais vagas não existem ou não estão ativas no shopping.');
    const dispositivo = await tx.dispositivo.create({
      data: { shoppingId, codigo: placaCodigo, nome: placaNome, chaveApiHash },
    });
    for (const [indice, codigoVaga] of vagasCodigo.entries()) {
      const vaga = vagas.find((item) => item.codigo === codigoVaga);
      if (!vaga) throw new Error('Não foi possível resolver todas as vagas do provisionamento.');
      const sensorCodigo = `${placaCodigo}-S${String(indice + 1).padStart(2, '0')}`;
      await tx.sensor.create({
        data: { shoppingId, dispositivoId: dispositivo.id, vagaId: vaga.id, codigo: sensorCodigo },
      });
      await tx.vaga.update({
        where: { id: vaga.id },
        data: { dispositivoId: dispositivo.id, canalSensor: sensorCodigo, estadoAtual: 'INDISPONIVEL' },
      });
    }
    return { dispositivo, sensores: vagasCodigo.length };
  });
  console.log(`Placa criada: ${resultado.dispositivo.codigo} (${resultado.sensores} sensores).`);
  console.log(`Chave da placa (copie agora): ${chave}`);
} finally {
  await prisma.$disconnect();
}
