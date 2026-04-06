import { z } from 'zod';

export const registerSchema = z.object({
  nome: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(50, 'Nome muito longo'),
  email: z
    .string()
    .email('E-mail inválido'),
  password: z
    .string()
    .min(4, 'A senha deve ter no mínimo 4 caracteres'),
  passwordConfirm: z
      .string()
      .min(1, 'A confirmação de senha é obrigatória')
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não coincidem",
    path: ["passwordConfirm"],
});

export const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória')
});