const express = require('express');
const routeOptimizationRoutes = require('./optimizacionRutas.routes');

const enrutador = express.Router();

enrutador.use('/optimizacion-rutas', routeOptimizationRoutes);

module.exports = enrutador;