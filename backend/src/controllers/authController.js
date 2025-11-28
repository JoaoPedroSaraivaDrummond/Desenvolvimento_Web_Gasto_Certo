import { ZodError } from 'zod';
import { supabaseAdmin, supabasePublic } from '../config/supabase.js';
import { loginSchema, registerSchema } from '../utils/validation.js';

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.user_metadata?.name ?? '',
  createdAt: user.created_at,
});

const handleZodError = (error) => ({
  status: 400,
  message: error.errors.map((issue) => issue.message).join(' | '),
});

export const register = async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: { name: payload.name },
    });

    if (error) {
      error.status = 400;
      throw error;
    }

    const authResponse = await supabasePublic.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (authResponse.error) {
      authResponse.error.status = 400;
      throw authResponse.error;
    }

    return res.status(201).json({
      success: true,
      user: sanitizeUser(data.user),
      session: authResponse.data.session,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(handleZodError(error));
    }
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const { data, error } = await supabasePublic.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error) {
      error.status = 401;
      throw error;
    }

    return res.json({
      success: true,
      user: sanitizeUser(data.user),
      session: data.session,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(handleZodError(error));
    }
    return next(error);
  }
};

export const me = (req, res) => {
  return res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
};



