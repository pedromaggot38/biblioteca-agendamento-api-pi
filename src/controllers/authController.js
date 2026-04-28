import * as authService from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';
import { resfc } from '../utils/resfc.js';

export const register = catchAsync(async (req, res) => {
  const { passwordConfirm, ...userData } = req.body
  const usuario = await authService.registrarPrimeiroAdmin(userData);

  return resfc({
    res,
    code: 201,
    data: usuario,
    message: 'Primeiro administrador criado com sucesso!'
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  const result = await authService.autenticarUsuario(email, password);

  return resfc({
    res,
    code: 200,
    data: result,
    message: 'Login realizado com sucesso!'
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  await authService.solicitarRecuperacao(req.body.email);

  return resfc({ res, code: 200, message: 'Se o e-mail existir, as instruções foram enviadas.' });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { token, password } = req.body;

  await authService.resetarSenha(token, password);

  return resfc({ res, code: 200, message: 'Senha atualizada com sucesso!' });
});

export const getSystemStatus = catchAsync(async (req, res) => {
  const inicializado = await authService.verificarSistemaInicializado();

  return resfc({
    res,
    code: 200,
    data: { inicializado },
    message: inicializado
      ? 'Sistema pronto para login.'
      : 'Nenhum administrador encontrado. Redirecionar para registro.'
  });
});