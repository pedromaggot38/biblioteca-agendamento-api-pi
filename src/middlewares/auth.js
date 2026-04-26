import db from '../config/db.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { verificarToken } from '../utils/controllers/authUtils.js';

const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    throw new AppError('Acesso negado. Token não fornecido.', 401);
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new AppError('Erro no formato do token. Use o padrão Bearer.', 401);
  }

  const token = parts[1];

  const decoded = verificarToken(token);

  const user = await db('users').where({ id: decoded.id }).first();

  if (!user) {
    throw new AppError(
      'O usuário deste token não existe mais no sistema.',
      401,
    );
  }

  req.userId = decoded.id;

  next();
});

export default protect;
