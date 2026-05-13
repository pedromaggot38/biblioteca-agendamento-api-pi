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

const anoAtual = '2026';
const footerPadrao = `
  <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
    <p style="color: #94a3b8; font-size: 12px; margin: 0;">
      Sistema de Agendamento da Biblioteca
      <br>© ${anoAtual} Etec
    </p>
  </div>
`;

const templates = {
  TOKEN_VERIFICACAO: (dados) => ({
    subject: 'Código de Verificação - Biblioteca Etec',
    html: `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: 'Segoe UI', system-ui, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          <div style="background-color: #2c3e50; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px;">Biblioteca Etec</h1>
          </div>
          <div style="padding: 40px 30px; text-align: center;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">Confirme seu e-mail</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Olá! Para garantir a segurança do seu acesso administrativo, precisamos validar sua conta.</p>
            <div style="background-color: #f8f9fa; border: 2px dashed #3498db; padding: 20px; margin: 30px auto; width: fit-content; border-radius: 8px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">${dados.token}</span>
            </div>
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 0;">Se você não solicitou este código, por favor, ignore este e-mail.</p>
          </div>
          ${footerPadrao}
        </div>
      </div>
    `,
  }),

  RECUPERACAO_SENHA: (dados) => ({
    subject: 'Código de Recuperação - Biblioteca Etec',
    html: `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: 'Segoe UI', system-ui, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          <div style="background-color: #2c3e50; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px;">Biblioteca Etec</h1>
          </div>
          <div style="padding: 40px 30px; text-align: center;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">Olá, ${dados.nome}!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">Você solicitou a recuperação da sua senha administrativa.</p>
            <div style="background-color: #f8f9fa; border: 2px dashed #3498db; padding: 20px; margin: 30px auto; width: fit-content; border-radius: 8px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">${dados.token}</span>
            </div>
            <p style="color: #64748b; font-size: 13px;">Este código é válido por 5 minutos.</p>
          </div>
          ${footerPadrao}
        </div>
      </div>
    `,
  }),

  APROVACAO_AGENDAMENTO: (dados) => ({
    subject: 'Agendamento Confirmado - Biblioteca Etec',
    html: `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: 'Segoe UI', system-ui, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          <div style="background-color: #2c3e50; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px;">Biblioteca Etec</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">Olá, ${dados.nome}!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">Seu agendamento foi <strong style="color: #10b981;">confirmado</strong> com sucesso.</p>
            <div style="background-color: #f0fdf4; border-left: 5px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; color: #065f46; font-size: 16px;"><strong>📅 Data:</strong> ${dados.data}</p>
              <p style="margin: 5px 0 0 0; color: #065f46; font-size: 16px;"><strong>⏰ Horário:</strong> ${dados.horario}</p>
            </div>
            <p style="color: #444444; font-size: 15px;">Por favor, compareça no horário marcado. Se precisar cancelar, avise com antecedência.</p>
          </div>
          ${footerPadrao}
        </div>
      </div>
    `,
  }),

  RECUSA_AGENDAMENTO: (dados) => ({
    subject: 'Atualização do Agendamento - Biblioteca Etec',
    html: `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: 'Segoe UI', system-ui, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
          <div style="background-color: #2c3e50; padding: 25px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 1px;">Biblioteca Etec</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700;">Olá, ${dados.nome}.</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">Seu agendamento para o dia <strong>${dados.data}</strong> não pôde ser aprovado.</p>
            <div style="background-color: #fef2f2; border-left: 5px solid #ef4444; padding: 20px; margin: 25px 0; border-radius: 4px;">
              <p style="margin: 0; color: #991b1b; font-size: 15px;">Por favor, verifique a disponibilidade de outros dias ou horários no sistema.</p>
            </div>
          </div>
          ${footerPadrao}
        </div>
      </div>
    `,
  }),
};

export const enviarEmail = async (para, tipo, dados) => {
  try {
    const template = templates[tipo](dados);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: para,
      subject: template.subject,
      html: template.html,
    });

    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar e-mail do tipo [${tipo}]:`, error);
    return false;
  }
};
