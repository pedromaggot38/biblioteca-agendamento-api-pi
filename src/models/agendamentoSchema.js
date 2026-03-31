import { z } from 'zod';

const agendamentoSchema = z
  .object({
    rm: z
      .string()
      .length(5, 'O RM deve ter exatamente 5 dígitos')
      .regex(/^\d+$/, 'RM deve conter apenas números'),
    email: z
      .email('E-mail inválido')
      .endsWith('@instituicao.edu.br', 'Use o e-mail institucional'),
    curso: z.string().min(2, 'Informe o curso técnico'),
    servicoLevantamento: z.boolean().default(false),
    servicoNormalizacao: z.boolean().default(false),
    dataAtendimento: z.string().transform((val) => new Date(val)),
    horaAtendimento: z
      .string()
      .regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  })
  .refine((data) => data.servicoLevantamento || data.servicoNormalizacao, {
    message: 'Selecione ao menos um tipo de serviço',
    path: ['servicoLevantamento'],
  });

export { agendamentoSchema };
