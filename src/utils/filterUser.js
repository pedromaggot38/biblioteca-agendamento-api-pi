export const sanitizeUser = (user) => {
  if (!user) return null;

  const {
    id,
    nome,
    email,
    is_verified,
    created_at
  } = user;

  return { id, nome, email, is_verified, created_at };
};