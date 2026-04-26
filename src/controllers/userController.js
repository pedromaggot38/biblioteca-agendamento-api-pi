import * as userService from "../services/userService.js";
import catchAsync from "../utils/catchAsync.js";
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

export const updateMe = catchAsync(async (req, res) => {
  const { nome, email } = req.body;
  
  const usuarioAtualizado = await userService.atualizarDadosUsuario(req.user.id, { nome, email });

  return resfc({
    res,
    code: 200,
    data: { user: usuarioAtualizado },
    message: 'Dados atualizados com sucesso!'
  });
});