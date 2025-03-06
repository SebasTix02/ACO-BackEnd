const express = require('express');
const router = express.Router();
const {
  obtenerRutas,
  obtenerRuta,
  crearRuta,
  actualizarRuta,
  eliminarRuta,
  obtenerRutasPorEstado,
  actualizarEstadoPedidos
} = require('../controllers/rutasOptimizadas.controller');
const validarJWT = require('../middleware/validarJWT');
const validarPrivilegios = require('../middleware/validarPrivilegios');

router.get('/', validarJWT, obtenerRutas);
router.get('/estado/:estado', validarJWT, obtenerRutasPorEstado);
router.get('/:id', validarJWT, obtenerRuta);
router.post('/', validarJWT, validarPrivilegios('basico'), crearRuta);
router.put('/:id', validarJWT, validarPrivilegios('basico'), actualizarRuta);
router.delete('/:id', validarJWT, validarPrivilegios('basico'), eliminarRuta);
router.post('/:idRuta/actualizar-estado/:nuevoEstado',
  validarJWT,
  validarPrivilegios('admin'),
  actualizarEstadoPedidos
);

module.exports = router;