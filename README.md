# 📚 Sistema de Agendamento Biblioteca ETEC - Projeto Integrador UNIVESP

Este é o back-end do sistema de agendamento para serviços de levantamento bibliográfico e normalização de trabalhos acadêmicos. Desenvolvido para facilitar a organização da biblioteca, o sistema permite que alunos agendem horários específicos, garantindo que não haja conflitos de agenda.

## 🚀 Tecnologias Utilizadas

* **Runtime**: Node.js
* **Framework**: Express 5
* **Banco de Dados**: SQLite3 (gerenciado via Knex.js)
* **Validação**: Zod
* **Containerização**: Docker & Docker Compose

## 🛠️ Regras de Negócio Implementadas

Para garantir a integridade dos dados e da agenda, o sistema possui as seguintes travas automáticas:

* **Horários**: Apenas entre **08:00 e 16:00**, em intervalos de **30 minutos**.
* **Data**: Não é permitido agendar para datas retroativas (anteriores a hoje).
* **Conflitos**: O sistema impede que dois alunos agendem o mesmo horário no mesmo dia.
* **Consistência**: O RM deve ter exatamente 5 dígitos e o e-mail deve ser o institucional (`@etec.sp.gov.br`).
* **Vínculo**: Uma vez que um RM é cadastrado com um e-mail, o sistema bloqueia tentativas de usar esse RM com e-mails diferentes.
* **Padronização**: Nomes e cursos são automaticamente formatados para *Title Case*.

## 🐳 Como Rodar com Docker

Você não precisa ter o Node.js instalado na sua máquina física, apenas o **Docker**.

### 1. Iniciar o Projeto
Suba os containers pela primeira vez (isso instalará as dependências e iniciará o servidor):
```bash
docker compose up --build
```

### 2. Comandos de Banco de Dados (Database)
Como o ambiente está dentro do container, utilize o `docker compose exec` para rodar os comandos do banco:

* **Reset Completo**: Apaga o banco atual, recria as tabelas:
    ```bash
    docker compose exec app npm run db:reset
    ```
* **Apenas Inserir Dados (Seeds)**: Adiciona os 15 agendamentos de teste (seeds) sem apagar o banco:
    ```bash
    docker compose exec app npm run db:seed
    ```

## 🛣️ Rotas da API (`/api/v1/agendamentos`)

| Método | Rota | Descrição | Parâmetros de Query |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Lista agendamentos paginados | `page`, `limit`, `status` |
| **POST** | `/` | Solicita um novo agendamento | (Body JSON) |
| **PATCH** | `/:id/status` | Altera status (APROVADO/RECUSADO) | `id` (na URL) |
| **DELETE** | `/:id` | Remove um agendamento do sistema | `id` (na URL) |

### Exemplo de Filtro por Status
Para ver apenas os agendamentos pendentes no dashboard:
`GET http://localhost:3000/api/v1/agendamentos?status=PENDENTE`

---

## 📂 Estrutura de Pastas Principal

* `src/controllers/`: Lógica de recebimento de requisições.
* `src/services/`: Regras de negócio e comunicação com o banco.
* `src/models/`: Esquemas de validação (Zod).
* `src/utils/controllers/`: Validadores específicos de data e hora.
* `src/database/migrations/`: Estrutura das tabelas do banco.