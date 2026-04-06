import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const registrarPrimeiroAdmin = async (dados) => {
  const { nome, email, password } = dados;

  const { total } = await db('users').count('id as total').first();
  
  if (total > 0) {
    const error = new Error('O sistema já possui um administrador cadastrado.');
    error.statusCode = 403;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [id] = await db('users').insert({
    nome,
    email,
    password: hashedPassword,
  });

  return { id, nome, email };
};

export const autenticarUsuario = async (email, password) => {
  const user = await db('users').where({ email }).first();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error('E-mail ou senha incorretos.');
    error.statusCode = 401;
    throw error;
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
    const error = new Error('Sessão inválida ou usuário inexistente.');
    error.statusCode = 401;
    throw error;
  }

  return user;
};

export const verificarSistemaInicializado = async () => {
  const result = await db('users').count('id as total').first();
  
  return parseInt(result.total) > 0;
};