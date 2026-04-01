const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error.issues) {
      return res.status(400).json({
        erros: error.issues.map((err) => ({
          campo: err.path[err.path.length - 1] || 'formulario',
          mensagem: err.message,
        })),
      });
    }

    next(error);
  }
};

export default validate;
