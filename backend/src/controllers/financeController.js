import { ZodError } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { expenseSchema, salarySchema } from '../utils/validation.js';

const parseNumber = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error('Valor numérico inválido.');
  }
  return parsed;
};

const handleZod = (error) => ({
  status: 400,
  message: error.errors.map((issue) => issue.message).join(' | '),
});

export const upsertSalary = async (req, res, next) => {
  try {
    const payload = salarySchema.parse({
      ...req.body,
      amount: parseNumber(req.body.amount),
    });

    const { data, error } = await supabaseAdmin
      .from('salaries')
      .upsert({
        user_id: req.user.id,
        amount: payload.amount,
        reference_month: payload.referenceMonth || null,
      })
      .select()
      .single();

    if (error) {
      error.status = 400;
      throw error;
    }

    return res.json({ success: true, salary: data });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(handleZod(error));
    }
    return next(error);
  }
};

export const addExpense = async (req, res, next) => {
  try {
    const payload = expenseSchema.parse({
      ...req.body,
      amount: parseNumber(req.body.amount),
    });

    const { data, error } = await supabaseAdmin
      .from('expenses')
      .insert({
        user_id: req.user.id,
        description: payload.description,
        category: payload.category || 'Geral',
        amount: payload.amount,
        occurred_on: payload.occurredOn || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      error.status = 400;
      throw error;
    }

    return res.status(201).json({ success: true, expense: data });
  } catch (error) {
    if (error instanceof ZodError) {
      return next(handleZod(error));
    }
    return next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const [{ data: salary, error: salaryError }, { data: expenses, error: expenseError }] = await Promise.all([
      supabaseAdmin
        .from('salaries')
        .select('*')
        .eq('user_id', req.user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from('expenses')
        .select('*')
        .eq('user_id', req.user.id)
        .order('occurred_on', { ascending: false }),
    ]);

    if (salaryError || expenseError) {
      throw salaryError || expenseError;
    }

    const totalExpenses = expenses?.reduce((sum, item) => sum + Number(item.amount || 0), 0) ?? 0;
    const salaryAmount = Number(salary?.amount || 0);
    const remaining = salaryAmount - totalExpenses;

    return res.json({
      success: true,
      salary: salary ?? null,
      expenses: expenses ?? [],
      totalExpenses,
      remaining,
    });
  } catch (error) {
    return next(error);
  }
};



