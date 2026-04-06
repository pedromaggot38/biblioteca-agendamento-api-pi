import { autenticarUsuario, getMe, registrarPrimeiroAdmin, verificarSistemaInicializado } from '../services/authService.js';
import catchAsync from '../utils/catchAsync.js';
import { resfc } from '../utils/response.js';

export const register = catchAsync(async (req, res) => {
  const usuario = await registrarPrimeiroAdmin(req.body);

  return resfc(res, 201, usuario, 'Primeiro administrador criado com sucesso!');
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await autenticarUsuario(email, password);
  
  return resfc(res, 200, result, 'Login realizado com sucesso!');
});

export const me = catchAsync(async (req, res) => {
  const user = await getMe(req.userId);
  
  return resfc(res, 200, user, 'Sessão validada com sucesso!');
});

export const getSystemStatus = catchAsync(async (req, res) => {
  const inicializado = await verificarSistemaInicializado();
  
  return resfc(
    res, 
    200, 
    { inicializado }, 
    inicializado ? 'Sistema pronto para login.' : 'Nenhum administrador encontrado. Redirecionar para registro.'
  );
});