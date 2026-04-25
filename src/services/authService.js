import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import AppError from '../utils/appError.js';

export const registrarPrimeiroAdmin = async (dados) => {
  const { total } = await db('users').count('id as total').first();

  if (total > 0) {
    throw new AppError('O sistema já possui um administrador cadastrado.', 403);
  }

  const [id] = await db('users').insert({
    ...dados,
    password: await bcrypt.hash(dados.password, 10)
  });

  return { id, nome: dados.nome, email: dados.email };
};

export const autenticarUsuario = async (email, password) => {
  const user = await db('users').where({ email }).first();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('E-mail ou senha incorretos.', 401);
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '4h' });

  return {
    token,
    user: { nome: user.nome, email: user.email }
  };
};

export const getMe = async (id) => {
  const user = await db('users')
    .where({ id })
    .select('id', 'nome', 'email')
    .first();

  if (!user) {
    throw new AppError('Sessão inválida ou usuário inexistente.', 401);
  }

  return user;
};

export const verificarSistemaInicializado = async () => {
  const result = await db('users').count('id as total').first();

  return parseInt(result.total) > 0;
};