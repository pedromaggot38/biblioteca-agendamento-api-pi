import { z } from 'zod';

const normalizeInput = (val) => val.trim().toLowerCase();

const userBaseFields = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(50, 'Nome muito longo'),
  email: z.email('Email inválido').transform(normalizeInput),
  password: z
    .string()
    .min(4, 'A senha deve ter no mínimo 4 caracteres'),
  passwordConfirm: z.string().min(1, 'A confirmação de senha é obrigatória'),
});

export const registerSchema = userBaseFields.refine(
  (data) => data.password === data.passwordConfirm,
  {
    message: "As senhas não coincidem",
    path: ["passwordConfirm"],
  }
);

export const loginSchema = z.object({
  email: userBaseFields.shape.email,
  password: z.string().min(1, 'A senha é obrigatória'),
});

export const forgotPasswordSchema = z.object({
  email: userBaseFields.shape.email,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'O token é obrigatório'),
    password: userBaseFields.shape.password,
    passwordConfirm: userBaseFields.shape.passwordConfirm,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não coincidem',
    path: ['passwordConfirm'],
  });

export const updateMeSchema = userBaseFields
  .pick({
    nome: true,
    email: true,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualização',
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: userBaseFields.shape.password,
    passwordConfirm: userBaseFields.shape.passwordConfirm,
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    message: 'As novas senhas não coincidem',
    path: ['passwordConfirm'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'A nova senha não pode ser igual à senha atual',
    path: ['newPassword'],
  });