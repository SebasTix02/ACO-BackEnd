const express = require('express');
const routeOptimizationRoutes = require('./routeOptimization.routes');

const router = express.Router();

router.use('/optimizacion-rutas', routeOptimizationRoutes);

module.exports = router;