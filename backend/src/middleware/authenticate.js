import { supabasePublic } from '../config/supabase.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token não informado.' });
  }

  const [, token] = authHeader.split(' ');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Formato de token inválido.' });
  }

  const { data, error } = await supabasePublic.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado.' });
  }

  req.user = data.user;
  req.token = token;
  return next();
};



