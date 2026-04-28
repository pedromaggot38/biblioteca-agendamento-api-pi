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
      <div style="background-color: #f4f4f9; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e9ecef; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">Biblioteca Etec</h1>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #2c3e50; margin-top: 0; font-size: 20px;">Olá, ${dados.nome}!</h2>
            <p style="color: #444444; font-size: 16px; line-height: 1.6;">Você solicitou a alteração da sua senha administrativa.</p>
            <p style="color: #444444; font-size: 16px; line-height: 1.6;">Clique no botão abaixo para criar uma nova senha com segurança:</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${dados.link}" style="background-color: #3498db; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 25px 0;">
            <p style="color: #7f8c8d; font-size: 13px; margin: 0; text-align: center;">Este link expira em 10 minutos. Se não foi você quem solicitou, por favor, ignore este e-mail.</p>
          </div>

        </div>
      </div>
    `,
  }),

  APROVACAO_AGENDAMENTO: (dados) => ({
    subject: 'Agendamento Confirmado - Biblioteca Etec',
    html: `
      <div style="background-color: #f4f4f9; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e9ecef; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">Biblioteca Etec</h1>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #2c3e50; margin-top: 0; font-size: 20px;">Olá, ${dados.nome}!</h2>
            <p style="color: #444444; font-size: 16px; line-height: 1.6;">Temos uma ótima notícia! Seu agendamento para atendimento na biblioteca foi <strong style="color: #27ae60;">confirmado</strong>.</p>
            
            <div style="background-color: #f8f9fa; border-left: 5px solid #27ae60; padding: 18px 20px; margin: 25px 0; border-radius: 0 4px 4px 0;">
              <p style="margin: 0 0 10px 0; color: #2c3e50; font-size: 16px;"><strong>📅 Data:</strong> ${dados.data}</p>
              <p style="margin: 0; color: #2c3e50; font-size: 16px;"><strong>⏰ Horário:</strong> ${dados.horario}</p>
            </div>
            
            <p style="color: #444444; font-size: 16px; line-height: 1.6;">Por favor, compareça no horário marcado na biblioteca da unidade. Se precisar cancelar, avise com antecedência.</p>
          </div>

        </div>
      </div>
    `,
  }),

  RECUSA_AGENDAMENTO: (dados) => ({
    subject: 'Atualização do Agendamento - Biblioteca Etec',
    html: `
      <div style="background-color: #f4f4f9; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e9ecef; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          
          <div style="background-color: #2c3e50; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">Biblioteca Etec</h1>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #2c3e50; margin-top: 0; font-size: 20px;">Olá, ${dados.nome}.</h2>
            <p style="color: #444444; font-size: 16px; line-height: 1.6;">Infelizmente, seu agendamento solicitado para o dia <strong>${dados.data}</strong> não pôde ser aprovado neste momento.</p>
            
            <div style="background-color: #fdedec; border-left: 5px solid #e74c3c; padding: 18px 20px; margin: 25px 0; border-radius: 0 4px 4px 0;">
              <p style="margin: 0; color: #c0392b; font-size: 15px;">Por favor, verifique a disponibilidade de outros dias ou horários e tente realizar um novo agendamento no sistema.</p>
            </div>
            
            <p style="color: #444444; font-size: 16px; line-height: 1.6;">Qualquer dúvida, procure a administração presencialmente.</p>
          </div>

        </div>
      </div>
    `,
  })
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