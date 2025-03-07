const express = require('express');
const router = express.Router();
const {
    obtenerUbicaciones,
    obtenerUbicacion,
    crearUbicacion,
    actualizarUbicacion,
    eliminarUbicacion,
    obtenerPorCliente
} = require('../controllers/ubicacionesTemporales.controller');
const validarCookie = require('../middleware/validarCookie');
const validarPrivilegios = require('../middleware/validarPrivilegios');
const { validarDatosUbicacion } = require('../middleware/validarUbicacion');

router.get('/', validarCookie, obtenerUbicaciones);
router.get('/cliente/:codCliente', validarCookie, obtenerPorCliente);
router.get('/:id', validarCookie, obtenerUbicacion);
router.post(
    '/',
    validarCookie,
    validarPrivilegios('admin'),
    validarDatosUbicacion,
    crearUbicacion
);
router.put(
    '/:id',
    validarCookie,
    validarPrivilegios('admin'),
    validarDatosUbicacion,
    actualizarUbicacion
);
router.delete('/:id', validarCookie, validarPrivilegios('admin'), eliminarUbicacion);

module.exports = router;