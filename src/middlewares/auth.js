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

  try {
    const decoded = verificarToken(token);

    if (!decoded || !decoded.id) {
      return next(new AppError('Token inválido ou malformado.', 401));
    }

    const user = await db('users').where({ id: decoded.id }).first();

    if (!user) {
      return next(new AppError('O usuário não existe mais.', 401));
    }

    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    return next(new AppError('Sessão expirada ou inválida.', 401));
  }
});

export const onlyVerifiedUsers = (req, res, next) => {
  if (!req.user.is_verified) {
    return res.status(403).json({
      status: 'fail',
      message: 'Acesso restrito. Por favor, confirme seu e-mail para realizar esta ação.'
    });
  }
  next();
};

export default protect;
