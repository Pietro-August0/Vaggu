-- Mantém no PostgreSQL somente a referência da foto armazenada fora do banco.
ALTER TABLE "shoppings" ADD COLUMN "imagem_url" TEXT;

-- A senha provisória passa a existir somente na resposta de criação/redefinição; o banco mantém apenas o hash.
ALTER TABLE "usuarios" DROP COLUMN "senha_provisoria_protegida";

-- A implementação anterior não chegou a integrar o fluxo de cadastro; arquivos precisam ser reenviados ao Blob.
DROP TABLE "fotos_shopping";
