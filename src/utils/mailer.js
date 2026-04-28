import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const templates = {
  RECUPERACAO_SENHA: (dados) => ({
    subject: 'Recuperação de Senha - Biblioteca Etec',
    html: `
      <div style="font-family: sans-serif; color: #2c3e50;">
        <h2>Olá, ${dados.nome}</h2>
        <p>Você solicitou a alteração da sua senha administrativa.</p>
        <p>Clique no botão abaixo para prosseguir:</p>
        <a href="${dados.link}" style="background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Redefinir Senha</a>
        <p style="font-size: 12px; color: #7f8c8d; margin-top: 20px;">Este link expira em 1 hora. Se não foi você, ignore este e-mail.</p>
      </div>
    `,
  }),
  APROVACAO_AGENDAMENTO: (dados) => ({
    subject: 'Agendamento Confirmado - Biblioteca Etec',
    html: `
      <div style="font-family: sans-serif; color: #2c3e50;">
        <h2>Excelente notícia, ${dados.nome}!</h2>
        <p>Seu agendamento para atendimento na biblioteca foi <strong>aprovado</strong>.</p>
        <div style="border-left: 4px solid #27ae60; padding-left: 15px; margin: 20px 0;">
          <p><strong>Data:</strong> ${dados.data}</p>
          <p><strong>Horário:</strong> ${dados.horario}</p>
        </div>
        <p>Por favor, compareça no horário marcado na biblioteca da unidade.</p>
      </div>
    `,
  }),
};

/**
 * Função Única de Envio de E-mail
 * @param {string} para - E-mail do destinatário
 * @param {string} tipo - Tipo do template (ex: 'RECUPERACAO_SENHA')
 * @param {object} dados - Dados necessários para preencher o template
 */
export const enviarEmail = async (para, tipo, dados) => {
  try {
    const template = templates[tipo](dados);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: para,
      subject: template.subject,
      html: template.html,
    });

    console.log(`✉️ E-mail do tipo [${tipo}] enviado com sucesso: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar e-mail do tipo [${tipo}]:`, error);
    return false;
  }
};