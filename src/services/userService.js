import db from "../config/db.js";
import AppError from "../utils/appError.js";

export const atualizarDadosUsuario = async (id, dados) => {
  const [user] = await db('users')
    .where({ id })
    .update(dados)
    .returning(['id', 'nome', 'email']);

  if (!user) throw new AppError('Usuário não encontrado', 404);
  
  return user;
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