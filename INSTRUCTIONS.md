# INSTRUÇÕES PARA EXECUÇÃO DO PROJETO

## 1. Subir o banco de dados com Docker

Se você tem Docker instalado, execute o comando abaixo na raiz do projeto para subir o PostgreSQL:

```sh
docker run --name policia_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=policia_db -p 5432:5432 -d postgres
```

> Isso irá criar um container chamado `policia_db` rodando na porta padrão 5432.

---

## 2. Executar as migrations

Com o banco rodando, execute:

```sh
npx knex migrate:latest
```

> Isso irá criar as tabelas necessárias no banco de dados.

---

## 3. Rodar as seeds

Para popular o banco com dados iniciais, execute:

```sh
npx knex seed:run
```

> Isso irá inserir agentes e casos de exemplo nas tabelas.

---

## Observações

- Certifique-se de que o arquivo `.env` está configurado corretamente com usuário, senha e nome do banco.
- Se quiser parar o banco, use:
  ```sh
  docker stop policia_db
  ```
- Para iniciar novamente:
  ```sh