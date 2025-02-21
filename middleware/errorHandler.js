const { OpenRouteServiceError } = require('../utils/errors');

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof OpenRouteServiceError) {
    return res.status(503).json({
      error: 'External service error',
      message: err.message
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
}

module.exports = errorHandler;