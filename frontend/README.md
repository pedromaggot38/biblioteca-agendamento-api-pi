# Sistema de Agendamento Biblioteca Etec - Frontend 📚

Este é o repositório do frontend para o Sistema de Agendamento da Biblioteca, desenvolvido como parte do Projeto Integrador. A interface foi construída para ser intuitiva, responsiva e integrada com uma API REST robusta.

## 🚀 Tecnologias Utilizadas

- **HTML5 & CSS3**: Estrutura e estilização com variáveis modernas e layout responsivo.
- **JavaScript (Vanilla JS)**: Lógica de front-end sem dependências pesadas, garantindo performance.
- **Fetch API**: Comunicação assíncrona com o Backend.
- **Interatividade**: Notificações dinâmicas, validação de formulários em tempo real e estados de carregamento.

## 📂 Estrutura de Pastas

- `/assets`: Recursos estáticos (favicons, ícones).
- `/css`: Estilização global e componentes.
- `/js`:
  - `/auth`: Gerenciamento de login, registo, proteção de rotas (CheckAuth) e recuperação de senha.
  - `/dashboard`: Scripts para o painel administrativo, agendamentos e perfil.
  - `/utils`: Utilitários para UI e notificações.
- `/pages`:
  - `/dashboard`: Áreas restritas para utilizadores autenticados.
  - Páginas públicas de autenticação e erro.
- `index.html`: Página principal (Landing Page e Formulário de Agendamento).

## ⚙️ Configuração e Execução

Este frontend foi desenhado para rodar em conjunto com o [Backend do Projeto](https://github.com/pedromaggot38/biblioteca-agendamento-pi).

1. Certifique-se de que o seu Backend está ativo.
2. O arquivo de configuração de scripts aponta por padrão para `http://localhost:3000/api/v1`.
3. Abra o `index.html` utilizando um servidor local (como a extensão **Live Server** do VS Code) para evitar problemas de CORS e garantir o funcionamento das rotas.

## 🔐 Funcionalidades Implementadas

- **Sistema de Agendamento**: Formulário completo com validação de RM institucional.
  - **Consulta de Disponibilidade em Tempo Real**: O calendário de agendamento consome o banco de dados para mostrar apenas horários que não conflitem com outros alunos.
- **Área Administrativa**: Painel para gerir solicitações com filtros por status e pesquisa.
- **Gestão de Perfil**:
  - Alteração de dados pessoais.
  - **Troca de E-mail Segura**: Permite a alteração do e-mail com envio de código OTP para o novo endereço.
  - **Grace Period**: Permite que utilizadores que registaram o e-mail incorretamente corrijam o endereço mesmo antes da verificação da conta, desde que autenticados.
- **Segurança**: Verificação de token JWT em cada transição de página.
