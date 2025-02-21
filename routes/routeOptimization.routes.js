const express = require('express');
const { optimizeRoute } = require('../controllers/routeOptimization.controller');
const validateRouteInput = require('../middleware/validateRouteInput');

const router = express.Router();

router.post('/optimizar', validateRouteInput, optimizeRoute);

module.exports = router;