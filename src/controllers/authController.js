import {
  autenticarUsuario,
  getMe,
  registrarPrimeiroAdmin,
  verificarSistemaInicializado
} from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';
import { resfc } from '../utils/resfc.js';

export const register = catchAsync(async (req, res) => {
  const { passwordConfirm, ...userData } = req.body

  const usuario = await registrarPrimeiroAdmin(userData);

  return resfc({
    res,
    code: 201,
    data: usuario,
    message: 'Primeiro administrador criado com sucesso!'
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await autenticarUsuario(email, password);

  return resfc({
    res,
    code: 200,
    data: result,
    message: 'Login realizado com sucesso!'
  });
});

export const me = catchAsync(async (req, res) => {
  const user = await getMe(req.userId);

  return resfc({
    res,
    code: 200,
    data: user,
    message: 'Sessão validada com sucesso!'
  });
});

export const getSystemStatus = catchAsync(async (req, res) => {
  const inicializado = await verificarSistemaInicializado();

  return resfc({
    res,
    code: 200,
    data: { inicializado },
    message: inicializado
      ? 'Sistema pronto para login.'
      : 'Nenhum administrador encontrado. Redirecionar para registro.'
  });
});