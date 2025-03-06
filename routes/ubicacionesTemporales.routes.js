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
const validarJWT = require('../middleware/validarJWT');
const validarPrivilegios = require('../middleware/validarPrivilegios');
const { validarDatosUbicacion } = require('../middleware/validarUbicacion');

router.get('/', validarJWT, obtenerUbicaciones);
router.get('/cliente/:codCliente', validarJWT, obtenerPorCliente);
router.get('/:id', validarJWT, obtenerUbicacion);
router.post(
    '/',
    validarJWT,
    validarPrivilegios('admin'),
    validarDatosUbicacion,
    crearUbicacion
);
router.put(
    '/:id',
    validarJWT,
    validarPrivilegios('admin'),
    validarDatosUbicacion,
    actualizarUbicacion
);
router.delete('/:id', validarJWT, validarPrivilegios('admin'), eliminarUbicacion);

module.exports = router;