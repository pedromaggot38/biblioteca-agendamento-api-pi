# 📚 Sistema de Agendamento Biblioteca ETEC - Projeto Integrador UNIVESP

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Este é o back-end do sistema de agendamento para serviços de levantamento bibliográfico e normalização de trabalhos acadêmicos. Desenvolvido para facilitar a organização da biblioteca, o sistema agora conta com um portal administrativo seguro para o bibliotecário.

## 🚀 Tecnologias Utilizadas

* **Runtime**: Node.js
* **Framework**: Express 5
* **Banco de Dados**: SQLite3 (gerenciado via Knex.js)
* **Autenticação**: JSON Web Token (JWT) com `bcryptjs` para hashing de senhas
* **Validação**: Zod
* **Containerização**: Docker & Docker Compose

## 🛡️ Segurança

### Autenticação

O sistema implementa uma arquitetura de segurança robusta para proteger o gerenciamento dos agendamentos:

* **Proteção de Rotas**: Operações sensíveis (como alterar status ou excluir agendamentos) exigem um token **JWT (Bearer)** válido.
* **Criptografia**: As senhas dos administradores nunca são salvas em texto puro, sendo processadas com `bcryptjs`.
* **Primeiro Registro**: O sistema possui uma trava de segurança que só permite a criação de um administrador se a tabela de usuários estiver vazia.
* **Middleware de Autorização**: Valida a integridade e a expiração do token em cada requisição protegida.
* **Sanitização de Respostas**: O utilitário `resfc` garante que campos sensíveis, como senhas, nunca sejam enviados nas respostas JSON da API.

### Controle de Tráfego (Rate Limiting)

Para garantir a disponibilidade do serviço e proteger o sistema contra abusos, foram implementadas camadas de limitação de requisições (Rate Limiting):

* **Proteção de Login (Brute Force)**: Restrito a **8 tentativas por hora** por IP. Isso impede que scripts automatizados tentem adivinhar a senha do administrador.
* **Prevenção de Spam em Agendamentos**: Limite de **5 novos agendamentos por hora** por IP, evitando que a agenda seja preenchida maliciosamente por um único usuário.
* **Consulta de Disponibilidade**: Limite de **100 requisições a cada 15 minutos**, permitindo uma navegação fluida no calendário sem sobrecarregar o servidor.

### 📅 Inteligência de Disponibilidade

A rota de consulta de horários (`GET /disponibilidade`) possui regras de negócio integradas para garantir a consistência da agenda:

* **Bloqueio de Datas Passadas**: O sistema não processa consultas para datas anteriores ao dia atual. Se uma data retroativa for enviada, a API retorna um erro de validação ou uma lista vazia.
* **Filtro em Tempo Real**: Horários que já possuem agendamentos com status `PENDENTE` ou `APROVADO` são removidos automaticamente da lista de opções enviada ao frontend.

---

## ⚙️ Configuração de Ambiente (.env)

O projeto utiliza variáveis de ambiente para gerenciar configurações sensíveis e facilitar a portabilidade entre ambientes (desenvolvimento/produção).

**Exemplo de `.env`:**
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_ultra_secreta_aqui
DATABASE_FILENAME=./src/database/dev.db
```

## 🐳 Como Rodar com Docker

### 1. Iniciar o Projeto
Certifique-se de ter o arquivo `.env` configurado na raiz e execute:
```bash
docker compose up --build
```
### 2. Comandos de Banco de Dados (Database)

Como o ambiente está configurado dentro de containers, utilize o `docker compose exec` para executar os comandos de gerenciamento do banco de dados SQLite:

* **Reset Completo**: Este comando apaga o arquivo do banco de dados atual (`dev.db`), recria todas as tabelas através das migrations e deixa o sistema pronto para o uso inicial.
    ```bash
    docker compose exec app npm run db:reset
    ```
* **Inserir Dados de Teste (Seeds)**: Adiciona automaticamente 15 agendamentos de teste ao banco de dados para validar a interface e o funcionamento do sistema.
    ```bash
    docker compose exec app npm run db:seed
    ```

---

## 🛣️ Rotas da API (`/api/v1`)

### Autenticação (`/auth`)

| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| **GET** | `/status` | Verifica se já existe um administrador cadastrado no sistema. | Público |
| **POST** | `/register` | Registra o primeiro administrador (bloqueado se já houver um cadastro). | Público |
| **POST** | `/login` | Autentica o bibliotecário e retorna o Token JWT para acesso protegido. | Público |
| **GET** | `/me` | Valida o token e retorna os dados do administrador logado. | Protegido |

### Agendamentos (`/agendamentos`)

| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Lista todos os agendamentos com suporte a paginação e filtros. | Protegido |
| **POST** | `/` | Cria uma nova solicitação de agendamento (validação rigorosa via Zod). | Público |
| **PATCH** | `/:id` | Altera o status de um agendamento (APROVADO, RECUSADO ou PENDENTE). | Protegido |
| **DELETE** | `/:id` | Remove permanentemente um agendamento do banco de dados. | Protegido |

### Consulta de Disponibilidade (`/agendamentos/disponibilidade`)

Esta rota permite que o frontend consulte em tempo real quais horários ainda estão livres para uma determinada data, facilitando a experiência do usuário e evitando tentativas de agendamento em horários ocupados.

| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| **GET** | `/disponibilidade` | Retorna um array de strings com horários vagos | Público |

#### Parâmetros de Query (Query Params)
A rota espera obrigatoriamente o parâmetro `data` no formato `AAAA-MM-DD`.

**Exemplo de uso:**
`GET http://localhost:3000/api/v1/agendamentos/disponibilidade?data=2026-05-10`

**Resposta de Sucesso (200 OK):**
```json
{
  "status": "success",
  "message": "Horários disponíveis para 2026-05-10",
  "data": [
    "08:30",
    "09:00",
    "10:30",
    "14:00",
    "16:00"
  ]
}
```

---

## 📂 Estrutura de Pastas Principal

* **`src/controllers/`**: Responsável por receber as requisições, extrair dados e enviar as respostas padronizadas via `resfc`.
* **`src/services/`**: Camada onde reside toda a inteligência do sistema, regras de negócio e comunicação com o banco de dados.
* **`src/middlewares/`**: Inclui a proteção de rotas JWT, o validador de schemas Zod e o tratamento global de erros.
* **`src/models/`**: Definição dos schemas de validação para garantir a integridade dos dados de entrada.
* **`src/database/`**: Contém as migrations (estrutura das tabelas) e seeds (dados iniciais) do Knex.
* **`src/utils/`**: Funções auxiliares para formatação de strings, manipulação de datas e respostas da API.