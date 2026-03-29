const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
    });
  }

  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({ error: message });
};

module.exports = errorMiddleware;
