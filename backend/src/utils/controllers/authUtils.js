import jwt from 'jsonwebtoken';

export const gerarToken = (id, is_verified = false) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '6h';
  
  return jwt.sign(
    { 
      id, 
      is_verified
    }, 
    process.env.JWT_SECRET, 
    { expiresIn }
  );
};

export const verificarToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};