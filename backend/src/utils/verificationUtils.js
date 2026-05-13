import crypto from 'crypto';
import db from '../config/db.js';
import { enviarEmail } from './mailer.js';

export const enviarTokenVerificacao = async (userId, emailDestino, campoEmailTemp = null) => {
  const token = crypto.randomInt(100000, 999999).toString();
  
  const updateData = {
    verification_token: token
  };

  if (campoEmailTemp) {
    updateData.new_email = campoEmailTemp;
  } else {
    updateData.is_verified = false;
  }

  await db('users').where({ id: userId }).update(updateData);

  enviarEmail(emailDestino, 'TOKEN_VERIFICACAO', { token })
    .catch(err => console.error("Erro ao enviar token:", err));
    
  return token;
};