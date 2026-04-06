import { z } from 'zod';

const agendamentoSchema = z
  .object({
    rm: z
      .string()
      .length(5, 'O RM deve ter exatamente 5 dígitos')
      .regex(/^\d+$/, 'RM deve conter apenas números'),
    nome: z.string().min(4, 'Informe o nome completo'),
    email: z
      .email('E-mail inválido')
      .endsWith('@etec.sp.gov.br', 'Use o e-mail institucional'),
    curso: z.string().min(2, 'Informe o curso técnico'),
    servico_levantamento: z.boolean().default(false),
    servico_normalizacao: z.boolean().default(false),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (AAAA-MM-DD)'),
    horario: z
      .string()
      .regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  })
  .refine((data) => data.servico_levantamento || data.servico_normalizacao, {
    message: 'Selecione ao menos um tipo de serviço',
    path: ['servico_levantamento'],
  });

export const statusSchema = z.object({
  status: z.enum(['APROVADO', 'RECUSADO', 'PENDENTE'], {
    errorMap: () => ({
      message: 'O status deve ser APROVADO, RECUSADO ou PENDENTE',
    }),
  }),
});

export const disponibilidadeSchema = z.object({
  data: z
    .string({ required_error: "A data é obrigatória" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (deve ser AAAA-MM-DD)')
});

export { agendamentoSchema };
