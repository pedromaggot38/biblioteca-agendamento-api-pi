const errorHandler = (err, req, res, next) => {
  console.error('--- ERRO NO SERVIDOR ---');
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: true,
    message: err.message || 'Ocorreu um erro interno no servidor.',
    detail: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
