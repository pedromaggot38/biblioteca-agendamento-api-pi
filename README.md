# 📚 Sistema de Agendamento Biblioteca ETEC - Projeto Integrador UNIVESP

Este repositório contém o ecossistema completo do projeto de agendamento, dividido em Backend (API) e Frontend (Interface).

## 📂 Estrutura do Projeto

- **/backend**: API REST desenvolvida com Node.js, Express e Prisma. Gerencia autenticação, banco de dados e envio de e-mails.
- **/frontend**: Interface Web responsiva desenvolvida com Vanilla JavaScript, HTML5 e CSS3.

---

## 🚀 Como Executar o Projeto

### 1. Backend

O backend gerencia toda a lógica de segurança e persistência de dados.

- Acesse a pasta `/backend`.
- Configure as variáveis de ambiente (`.env`).
- Execute `npm install` e `npm run db:start` para a geração do banco de dados inicial.
- Inicie com `npm run dev`.

### 2. Frontend

A interface consome a API para realizar agendamentos e gerenciar o painel administrativo.

- Acesse a pasta `/frontend`.
- Certifique-se de que o backend está rodando em `http://localhost:3000`.
- Abra o `index.html` em seu navegador (recomendado usar Live Server).
