import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha precisa de pelo menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha precisa de pelo menos 6 caracteres'),
});

export const salarySchema = z.object({
  amount: z.number().positive('Informe um valor positivo'),
  referenceMonth: z.string().optional(),
});

export const expenseSchema = z.object({
  description: z.string().min(2),
  category: z.string().optional(),
  amount: z.number().positive(),
  occurredOn: z.string().optional(),
});



