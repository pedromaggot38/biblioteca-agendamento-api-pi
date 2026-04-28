import { rateLimit } from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    status: 'error',
    message: 'Muitas requisições vindas deste IP, tente novamente após 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createAgendamentoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  skipFailedRequests: true,
  message: {
    status: 'error',
    message: 'Limite de agendamentos atingido. Tente novamente em uma hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const lowRequestsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  message: {
    status: 'error',
    message: 'Muitas tentativas de login. Acesso bloqueado por 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});