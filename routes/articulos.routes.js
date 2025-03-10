const express = require('express');
const router = express.Router();
const {obtenerArticulos
} = require('../controllers/articulos.controller');
const validarCookie = require('../middleware/validarCookie');
const validarPrivilegios = require('../middleware/validarPrivilegios');

router.get('/', validarCookie, validarPrivilegios('basico'), obtenerArticulos);
module.exports = router;