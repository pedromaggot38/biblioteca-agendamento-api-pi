import db from '../config/db.js';
import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import { enviarTokenVerificacao } from '../utils/verificationUtils.js';
import { gerarToken } from '../utils/controllers/authUtils.js';

export const getMe = async (id) => {
  const user = await db('users')
    .where({ id })
    .select('id', 'nome', 'email', 'is_verified')
    .first();

  if (!user) {
    throw new AppError('Sessão inválida ou usuário inexistente.', 401);
  }

  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    is_verified: !!user.is_verified,
  };
};

export const prepararVerificacao = async (userId, novoEmail = null) => {
  const user = await db('users').where({ id: userId }).first();

  if (!user) throw new AppError('Usuário não encontrado.', 404);

  const emailFornecido = novoEmail || null;

  const destinoToken = emailFornecido || user.email;

  await enviarTokenVerificacao(user.id, destinoToken, emailFornecido);

  return { 
    emailEnviado: destinoToken, 
    isTroca: !!emailFornecido 
  };
};

export const processarVerificacaoToken = async (userId, token) => {
  const user = await db('users').where({ id: userId }).first();

  if (!user || user.verification_token !== token) {
    throw new AppError('Token de verificação inválido.', 400);
  }

  const updateData = {
    is_verified: true,
    verification_token: null,
    updated_at: new Date().toISOString(),
  };

  let mensagemSucesso = 'Conta verificada com sucesso!';

  // AJUSTE NA LÓGICA: Só trata como troca se o new_email existir E for diferente do atual
  if (user.new_email && user.new_email !== user.email) {
    updateData.email = user.new_email;
    updateData.new_email = null;
    mensagemSucesso = 'E-mail alterado e verificado com sucesso!';
  } else {
    // Se não for troca, garantimos que o new_email seja limpo de qualquer forma
    updateData.new_email = null;
  }

  const [userAtualizado] = await db('users')
    .where({ id: userId })
    .update(updateData)
    .returning(['id', 'nome', 'email', 'is_verified']);

  // Certifique-se de importar o gerarToken no topo do arquivo!
  const novoToken = gerarToken(user.id, true);

  return {
    token: novoToken,
    user: userAtualizado,
    message: mensagemSucesso,
  };
};

export const atualizarDadosUsuario = async (id, dados) => {
  const usuarioAtual = await db('users')
    .where({ id })
    .select('nome')
    .first();

  if (!usuarioAtual) throw new AppError('Usuário não encontrado', 404);

  const camposParaAtualizar = {};

  if (dados.nome && dados.nome.trim() !== usuarioAtual.nome) {
    camposParaAtualizar.nome = dados.nome.trim();
  }

  if (Object.keys(camposParaAtualizar).length === 0) {
    return null; 
  }

  const [user] = await db('users')
    .where({ id })
    .update({
      ...camposParaAtualizar,
      updated_at: new Date()
    })
    .returning(['id', 'nome', 'email']);

  return user;
};

export const atualizarSenha = async (userId, currentPassword, newPassword) => {
  const user = await db('users').where({ id: userId }).first();

  if (!user) throw new Error('Usuário não encontrado.');

  const currentPasswordIsValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );
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
    updated_at: new Date(),
  });

  return true;
};
