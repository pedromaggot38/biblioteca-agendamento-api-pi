import db from "../config/db.js";
import AppError from "../utils/appError.js";
import bcrypt from 'bcryptjs';

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

export const atualizarDadosUsuario = async (id, dados) => {
  const usuarioAtual = await db('users')
    .where({ id })
    .select('nome', 'email')
    .first();

  if (!usuarioAtual) throw new AppError('Usuário não encontrado', 404);

  const houveMudanca = 
    dados.nome !== usuarioAtual.nome || 
    dados.email !== usuarioAtual.email;

  if (!houveMudanca) {
    throw new AppError('Nenhuma alteração foi detectada.', 400);
  }

  const [user] = await db('users')
    .where({ id })
    .update({
      ...dados,
      updated_at: new Date()
    })
    .returning(['id', 'nome', 'email']);

  return user;
};

export const atualizarSenha = async (userId, currentPassword, newPassword) => {
  const user = await db('users').where({ id: userId }).first();

  if (!user) throw new Error('Usuário não encontrado.');

  const currentPasswordIsValid = await bcrypt.compare(currentPassword, user.password);
  if (!currentPasswordIsValid) {
    throw new Error('A senha atual está incorreta.');
  }

  const samePassword = await bcrypt.compare(newPassword, user.password);
  if (samePassword) {
    throw new Error('A nova senha deve ser diferente da senha atual.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await db('users').where({ id: userId }).update({ 
    password: hashedPassword,
    updated_at: new Date() 
  });

  return true;
};