import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const configFlagIndex = args.indexOf("--config");
const configPath = resolve(
  configFlagIndex >= 0
    ? args[configFlagIndex + 1] ?? ""
    : "ambiente.local/equipe-git.local.json",
);

const selection = args.filter((arg, index) => {
  if (arg === "--todos" || arg === "--config") return false;
  return configFlagIndex < 0 || index !== configFlagIndex + 1;
});
const includeAll = args.includes("--todos");

if (!includeAll && selection.length === 0) {
  throw new Error("Informe --todos ou pelo menos um username do GitHub.");
}

const config = JSON.parse(await readFile(configPath, "utf8"));
if (!Array.isArray(config.integrantes)) {
  throw new Error('A configuração precisa conter a lista "integrantes".');
}

const seen = new Set();
for (const member of config.integrantes) {
  if (!member.nome || !member.github) {
    throw new Error("Todos os integrantes precisam de nome e github.");
  }

  const username = member.github.toLowerCase();
  if (seen.has(username)) {
    throw new Error(`Username repetido na configuração: ${member.github}`);
  }
  seen.add(username);
}

const requested = new Set(selection.map((username) => username.toLowerCase()));
const members = includeAll
  ? config.integrantes
  : config.integrantes.filter((member) => requested.has(member.github.toLowerCase()));

if (!includeAll && members.length !== requested.size) {
  const found = new Set(members.map((member) => member.github.toLowerCase()));
  const missing = [...requested].filter((username) => !found.has(username));
  throw new Error(`Integrante(s) não encontrado(s): ${missing.join(", ")}`);
}

for (const member of members) {
  if (!member.emailCommit) {
    throw new Error(`E-mail de commit ainda não confirmado para ${member.github}.`);
  }
  if (/[\r\n<>]/u.test(member.nome) || /[\r\n<>]/u.test(member.emailCommit)) {
    throw new Error(`Nome ou e-mail inválido para ${member.github}.`);
  }
}

for (const member of members) {
  process.stdout.write(`Co-authored-by: ${member.nome} <${member.emailCommit}>\n`);
}
