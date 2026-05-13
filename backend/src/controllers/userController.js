import * as userService from "../services/userService.js";
import catchAsync from "../utils/catchAsync.js";
import { sanitizeUser } from "../utils/filterUser.js";
import { resfc } from "../utils/resfc.js";


export const me = catchAsync(async (req, res) => {
  const user = await userService.getMe(req.userId);

  return resfc({
    res,
    code: 200,
    data: user,
    message: 'Sessão validada com sucesso!'
  });
});

export const solicitarNovoTokenVerificacao = catchAsync(async (req, res) => {
  const { novoEmail } = req.body;
  const userId = req.user.id;

  const resultado = await userService.prepararVerificacao(userId, novoEmail);

  return resfc({
    res,
    code: 200,
    message: `Código enviado com sucesso para: ${resultado.emailEnviado}`
  });
});

export const verificarTokenVerificacao = catchAsync(async (req, res) => {
  const { token } = req.body;
  const userId = req.user.id; 

  const resultado = await userService.processarVerificacaoToken(userId, token);

  return resfc({
    res,
    code: 200,
    data: { 
      token: resultado.token,
      user: sanitizeUser(resultado.user) 
    },
    message: resultado.message
  });
});

export const updateMe = catchAsync(async (req, res) => {
const { nome } = req.body;
  
  const usuarioAtualizado = await userService.atualizarDadosUsuario(req.user.id, { nome });

  if (!usuarioAtualizado) {
    return resfc({
      res,
      code: 200,
      data: { user: sanitizeUser(req.user) },
      message: 'Nenhuma alteração foi detectada.'
    });
  }

  return resfc({
    res,
    code: 200,
    data: { user: usuarioAtualizado },
    message: 'Dados atualizados com sucesso!'
  });
});

export const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await userService.atualizarSenha(req.user.id, currentPassword, newPassword);

  return resfc({
    res,
    code: 200,
    message: 'Senha alterada com sucesso! Use a nova senha no próximo login.'
  });
});