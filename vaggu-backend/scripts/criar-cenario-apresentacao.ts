/** Cria um shopping fictício isolado para apresentação, sem alterar clientes existentes. */
import { randomBytes } from 'node:crypto';
import { open, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PrismaClient } from '@prisma/client';
import { createPrisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/auth/password.js';
import { ApiError } from '../src/auth/service.js';

const SHOPPING_ID = 'd3a09b29-7e5a-4b7e-8c42-8f371d0a0001';
const DIA_MS = 86_400_000;
const GERENTES = [
  { nome: 'Marina Azevedo', email: 'marina.azevedo@aurora-demo.example' },
  { nome: 'Rafael Nogueira', email: 'rafael.nogueira@aurora-demo.example' },
  { nome: 'Camila Duarte', email: 'camila.duarte@aurora-demo.example' },
];
const SETORES = [
  { andar: 'Piso G1', ordem: 1, nome: 'Ala Norte', prefixo: 'N' },
  { andar: 'Piso G1', ordem: 1, nome: 'Ala Sul', prefixo: 'S' },
  { andar: 'Piso G2', ordem: 2, nome: 'Ala Leste', prefixo: 'L' },
  { andar: 'Piso G2', ordem: 2, nome: 'Ala Oeste', prefixo: 'O' },
];

type Estado = 'LIVRE' | 'OCUPADA' | 'DESCONHECIDA';
type Credencial = { nome: string; email: string; senha: string; senhaHash: string };

function estadoDaVaga(indice: number, dia: number, fase: number): Estado {
  const valor = (indice * 13 + dia * 7 + fase * 17) % 100;
  if (valor < 4) return 'DESCONHECIDA';
  return valor < 64 ? 'OCUPADA' : 'LIVRE';
}

function tipoDaVaga(indice: number) {
  if (indice % 20 === 0 || indice % 20 === 1) return 'PCD';
  if (indice % 20 === 2 || indice % 20 === 3) return 'IDOSO';
  if (indice % 20 === 4) return 'ELETRICA';
  return 'COMUM';
}

export async function gerarCredenciaisApresentacao(): Promise<Credencial[]> {
  return Promise.all(GERENTES.map(async (gerente) => {
    const senha = randomBytes(18).toString('base64url');
    return { ...gerente, senha, senhaHash: await hashPassword(senha) };
  }));
}

/** A transação é atômica e recusa um cenário ou e-mail já existente. */
export async function criarCenarioApresentacao(prisma: PrismaClient, credenciais: Credencial[]) {
  if (await prisma.shopping.findUnique({ where: { id: SHOPPING_ID }, select: { id: true } })) {
    throw new ApiError(409, 'CENARIO_JA_EXISTE', 'O cenário já existe. Nenhum registro foi alterado e as senhas atuais foram preservadas.');
  }
  const emails = await prisma.usuario.findMany({ where: { email: { in: GERENTES.map((gerente) => gerente.email) } }, select: { email: true } });
  if (emails.length) throw new ApiError(409, 'EMAIL_EM_USO', 'Um e-mail do cenário já está em uso. Nenhum registro foi alterado.');
  const agora = new Date();
  const primeiroDia = Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate()) - 14 * DIA_MS;
  await prisma.$transaction(async (tx) => {
      await tx.shopping.create({ data: {
        id: SHOPPING_ID, nome: 'Shopping Aurora — DEMONSTRAÇÃO', demonstracao: true,
        cnpj: '00000000000000', responsavelNome: 'Equipe de apresentação VAGGU', responsavelCpf: '00000000000',
        emailCorporativo: 'contato@aurora-demo.example', telefone: '(11) 0000-0000', cep: '00000000',
        uf: 'SP', cidade: 'São Paulo', bairro: 'Bairro Exemplo', logradouro: 'Avenida Exemplo', numero: '100',
        complemento: 'Endereço fictício', endereco: 'Avenida Exemplo, 100 — Bairro Exemplo, São Paulo/SP',
        horarioAbertura: '10:00', horarioFechamento: '22:00', fusoHorario: 'America/Sao_Paulo',
        ativo: true, situacaoImplantacao: 'ATIVO',
      } });

      for (const gerente of credenciais) {
        await tx.usuario.create({ data: {
          shoppingId: SHOPPING_ID, nome: gerente.nome, email: gerente.email, senhaHash: gerente.senhaHash,
          perfil: 'SHOPPING', ativo: true, trocarSenhaObrigatoria: true,
        } });
      }

      const andares = new Map<string, string>();
      const historico: Array<{
        shoppingId: string; vagaId: string; eventoId: string; estadoAnterior: Estado | null; estado: Estado;
        efetivoEm: Date; recebidoEm: Date; origem: string; motivo: string;
      }> = [];
      let numeroVaga = 0;
      for (const setorDef of SETORES) {
        let andarId = andares.get(setorDef.andar);
        if (!andarId) {
          const andar = await tx.andar.create({ data: { shoppingId: SHOPPING_ID, nome: setorDef.andar, ordem: setorDef.ordem } });
          andarId = andar.id;
          andares.set(setorDef.andar, andarId);
        }
        const setor = await tx.setor.create({ data: { shoppingId: SHOPPING_ID, andarId, nome: setorDef.nome } });
        for (let posicao = 0; posicao < 20; posicao += 1) {
          const indice = numeroVaga++;
          const codigo = `${setorDef.prefixo}-${String(posicao + 1).padStart(2, '0')}`;
          const transicoes: Array<{ estado: Estado; instante: Date }> = [];
          let anterior: Estado | null = null;
          for (let dia = 0; dia <= 14; dia += 1) {
            for (const [fase, hora] of [[0, 0], [1, 8], [2, 12], [3, 18]]) {
              const instante = new Date(primeiroDia + dia * DIA_MS + hora * 3_600_000);
              if (instante > agora) continue;
              const estado = estadoDaVaga(indice, dia, fase);
              if (estado === anterior) continue;
              transicoes.push({ estado, instante });
              anterior = estado;
            }
          }
          const estadoAtual = transicoes.at(-1)?.estado ?? 'DESCONHECIDA';
          const vaga = await tx.vaga.create({ data: {
            shoppingId: SHOPPING_ID, andarId, setorId: setor.id, codigo, tipo: tipoDaVaga(indice),
            posicaoX: 0.06 + (posicao % 5) * 0.18, posicaoY: 0.08 + Math.floor(posicao / 5) * 0.21,
            largura: 0.12, altura: 0.1, rotacao: 0, estadoAtual,
            ultimaLeituraEm: transicoes.at(-1)?.instante ?? null, ativo: true,
          } });
          anterior = null;
          for (const [ordem, transicao] of transicoes.entries()) {
            historico.push({
              shoppingId: SHOPPING_ID, vagaId: vaga.id, eventoId: `demo-aurora:${codigo}:${ordem}`,
              estadoAnterior: anterior, estado: transicao.estado, efetivoEm: transicao.instante,
              recebidoEm: transicao.instante, origem: 'DEMONSTRACAO', motivo: 'CENARIO_FICTICIO',
            });
            anterior = transicao.estado;
          }
        }
      }
      for (let inicio = 0; inicio < historico.length; inicio += 500) {
        await tx.historicoVaga.createMany({ data: historico.slice(inicio, inicio + 500) });
      }
  }, { timeout: 120_000 });
  return { shoppingId: SHOPPING_ID, gerentes: credenciais.map(({ nome, email, senha }) => ({ nome, email, senha })) };
}

async function main() {
  const argumentoArquivo = process.argv.find((valor) => valor.startsWith('--credentials-file='));
  if (!process.argv.includes('--apply') || !argumentoArquivo) {
    throw new Error('Use --apply --credentials-file=CAMINHO com DEMO_DATABASE_URL configurada.');
  }
  const databaseUrl = process.env.DEMO_DATABASE_URL;
  if (!databaseUrl) throw new Error('Defina DEMO_DATABASE_URL para o banco escolhido; DATABASE_URL não é usada.');
  const destino = resolve(argumentoArquivo.slice('--credentials-file='.length));
  if (!destino.endsWith('.local')) throw new Error('O arquivo de credenciais deve terminar em .local para ficar fora do Git.');
  const credenciais = await gerarCredenciaisApresentacao();
  const prisma = createPrisma(databaseUrl);
  let arquivo: Awaited<ReturnType<typeof open>> | undefined;
  let concluido = false;
  try {
    arquivo = await open(destino, 'wx', 0o600);
    await arquivo.writeFile(JSON.stringify({ shopping: 'Shopping Aurora — DEMONSTRAÇÃO', gerentes: credenciais.map(({ nome, email, senha }) => ({ nome, email, senha })) }, null, 2));
    await arquivo.sync();

    await criarCenarioApresentacao(prisma, credenciais);
    concluido = true;
    console.log(`Cenário criado: ${SHOPPING_ID}; 3 gerentes, 2 andares, 4 setores, 80 vagas e 15 dias de histórico fictício.`);
    console.log(`Credenciais provisórias gravadas somente em: ${destino}`);
  } finally {
    if (arquivo) await arquivo.close();
    if (!concluido && arquivo) await unlink(destino).catch(() => undefined);
    await prisma.$disconnect();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((erro) => {
  console.error(erro instanceof Error ? erro.message : 'Falha ao criar o cenário de apresentação.');
  process.exitCode = 1;
});
