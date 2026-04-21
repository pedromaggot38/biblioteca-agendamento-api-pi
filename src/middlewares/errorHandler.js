import AppError from '../utils/appError.js';

/**
 * Traduz nomes de entidades/campos se necessário.
 */
const translateField = (field) => {
  const translations = {
    rm: 'RM',
    nome: 'Nome',
    email: 'E-mail',
    curso: 'Curso',
  };
  return translations[field] || field;
};

const handleZodError = (err) => {
  const errors = err.errors.map((e) => ({
    campo: translateField(e.path[e.path.length - 1]),
    mensagem: e.message,
  }));
  return new AppError('Erro de validação nos dados enviados.', 400, errors);
};

const handleJWTError = () =>
  new AppError('Token inválido. Faça login novamente.', 401);

const handleJWTExpiredError = () =>
  new AppError('Sua sessão expirou. Faça login novamente.', 401);


const sendErrorDev = (rawErr, treatedErr, res) => {
  res.status(treatedErr.statusCode || 500).json({
    status: treatedErr.status,
    message: treatedErr.message,
    errors: treatedErr.errors || [],
    stack: rawErr.stack,
    error: rawErr
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      errors: err.errors || [],
    });
  } else {
    console.error('--- ERRO CRÍTICO 💥 ---', err);
    res.status(500).json({
      status: 'error',
      message: 'Ocorreu um erro interno no servidor.',
    });
  }
};

const enrichError = (err) => {
  let error = err;

  if (err.name === 'ZodError') error = handleZodError(err);
  
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (err.code === 'SQLITE_CONSTRAINT') {
    const message = err.message.includes('UNIQUE') 
      ? 'Este registro já existe no sistema.' 
      : 'Erro de restrição no banco de dados.';
    error = new AppError(message, 400);
  }

  return error;
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const enrichedError = enrichError(err);

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, enrichedError, res);
  }

  sendErrorProd(enrichedError, res);
};