// Configuração de banco do backend. A especificação VAGGU define PostgreSQL
// como fonte persistente para produção, Power BI e isolamento por shopping.
export const projectRoot = process.cwd();

export function resolveDatabaseUrl(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('DATABASE_URL deve apontar para um PostgreSQL.');
  }
  const databaseUrl = value.trim();
  if (!/^postgres(ql)?:\/\//.test(databaseUrl)) {
    throw new Error('Use PostgreSQL em DATABASE_URL, como postgresql://usuario:senha@localhost:5432/vaggu.');
  }
  return databaseUrl;
}
