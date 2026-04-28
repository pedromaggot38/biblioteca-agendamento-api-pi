import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../config/db.js';
import AppError from '../utils/appError.js';
import { gerarToken } from '../utils/controllers/authUtils.js';
import { enviarEmail } from '../utils/mailer.js';

export const registrarPrimeiroAdmin = async (dados) => {
  const { total } = await db('users').count('id as total').first();

  if (total > 0) {
    throw new AppError('O sistema já possui um administrador cadastrado.', 403);
  }

  const is_verified = false;

  const [id] = await db('users').insert({
    ...dados,
    password: await bcrypt.hash(dados.password, 10),
    is_verified
  });

  const token = gerarToken(id, is_verified);

  return { 
    token,
    is_verified,
    user: { id, nome: dados.nome, email: dados.email } 
  };
};

export const autenticarUsuario = async (email, password) => {
  const user = await db('users').where({ email }).first();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('E-mail ou senha incorretos.', 401);
  }

  const token = gerarToken(user.id, user.is_verified);

  return {
    token,
    user: { 
      id: user.id, 
      nome: user.nome, 
      email: user.email,
      is_verified: !!user.is_verified
    }
  };
};

export const solicitarRecuperacao = async (email) => {
  const user = await db('users').where({ email }).first();
  if (!user) return;

  const token = crypto.randomInt(100000, 999999).toString();
  const expira = new Date(Date.now() + 300000).toISOString();

  await db('users').where({ id: user.id }).update({
    reset_token: token,
    reset_token_expires: expira
  });

  enviarEmail(user.email, 'RECUPERACAO_SENHA', { 
    nome: user.nome,
    token
  }).catch(err => console.error("Erro no envio de e-mail:", err));
};

export const resetarSenha = async (token, novaSenha) => {
  const agora = new Date().toISOString();

  const user = await db('users')
    .where({ reset_token: token })
    .andWhere('reset_token_expires', '>', agora)
    .first();

  if (!user) {
    throw new AppError('Código inválido ou expirado. Solicite uma nova recuperação.', 400);
  }

  const senhaIgualAAntiga = await bcrypt.compare(novaSenha, user.password);

  if (senhaIgualAAntiga) {
    throw new AppError('A nova senha não pode ser igual à senha atual.', 400);
  }

  const hashedPassword = await bcrypt.hash(novaSenha, 10);

  await db('users').where({ id: user.id }).update({
    password: hashedPassword,
    reset_token: null,
    reset_token_expires: null,
    updated_at: new Date().toISOString()
  });
};

export const verificarSistemaInicializado = async () => {
  const result = await db('users').count('id as total').first();

  return parseInt(result.total) > 0;
};