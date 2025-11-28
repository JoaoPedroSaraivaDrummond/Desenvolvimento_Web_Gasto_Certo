export const errorHandler = (err, req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Erro interno inesperado.';

  res.status(status).json({
    success: false,
    message,
  });
};



