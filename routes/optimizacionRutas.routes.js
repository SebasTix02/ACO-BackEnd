const express = require('express');
const { optimizarRuta } = require('../controllers/optimizacionRutas.controller');
const validarEntradas = require('../middleware/validarEntradas');

const enrutador = express.Router();

enrutador.post('/optimizar', validarEntradas, optimizarRuta);

module.exports = enrutador;