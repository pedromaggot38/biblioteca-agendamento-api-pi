const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      erros: error.errors.map((err) => ({
        campo: err.path[0],
        mensagem: err.message,
      })),
    });
  }
};

export default validate;
