const express = require('express');
const router = express.Router();
const {obtenerClientes
} = require('../controllers/clientes.controller');
const validarCookie = require('../middleware/validarCookie');
const validarPrivilegios = require('../middleware/validarPrivilegios');

router.get('/', validarCookie, validarPrivilegios('basico'), obtenerClientes);
module.exports = router;