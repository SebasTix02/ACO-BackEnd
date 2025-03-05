const { ErroresServicioOpenRoute } = require('../utils/errores');

function gestorErrores(err, req, res, next) {
  console.error(err);

  if (err instanceof ErroresServicioOpenRoute) {
    return res.status(503).json({
      error: 'Error Externo',
      message: err.message
    });
  }

  res.status(500).json({
    error: 'Error Interno',
    message: err.message
  });
}

module.exports = gestorErrores;