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
const validarCookie = require('../middleware/validarCookie');
const validarPrivilegios = require('../middleware/validarPrivilegios');

router.get('/', validarCookie, obtenerRutas);
router.get('/estado/:estado', validarCookie, obtenerRutasPorEstado);
router.get('/:id', validarCookie, obtenerRuta);
router.post('/', validarCookie, validarPrivilegios('basico'), crearRuta);
router.put('/:id', validarCookie, validarPrivilegios('basico'), actualizarRuta);
router.delete('/:id', validarCookie, validarPrivilegios('basico'), eliminarRuta);
router.post('/:idRuta/actualizar-estado/:nuevoEstado',
  validarCookie,
  validarPrivilegios('admin'),
  actualizarEstadoPedidos
);

module.exports = router;