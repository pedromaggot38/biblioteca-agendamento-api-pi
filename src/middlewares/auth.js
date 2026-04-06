import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Acesso negado. Token não fornecido.' 
    });
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Erro no formato do token. Use o padrão Bearer.' 
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, 'SUA_CHAVE_SECRETA_MUITO_SEGURA');

    // Adiciona os dados do usuário na requisição para uso futuro
    req.userId = decoded.id;
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Token inválido ou expirado.' 
    });
  }
};

export default auth;