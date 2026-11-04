-- PostgreSQL só permite usar um novo valor de enum após confirmar a transação que o criou.
ALTER TYPE "EstadoVaga" ADD VALUE IF NOT EXISTS 'INDISPONIVEL';
