const express = require('express');
const router = express.Router();
const {obtenerPedidos,obtenerPedido,crearPedido,actualizarPedido,eliminarPedido,obtenerPedidosPorEstado
} = require('../controllers/pedidos.controller');
const validarCookie = require('../middleware/validarCookie');
const validarPrivilegios = require('../middleware/validarPrivilegios');
const { validarPedido, validarEstadoPedido } = require('../middleware/validarPedido');

router.get('/', validarCookie, validarPrivilegios('admin'), obtenerPedidos);
router.get('/estado/:estado', validarCookie, validarPrivilegios('admin'), obtenerPedidosPorEstado);
router.get('/:id', validarCookie, validarPrivilegios('admin'), obtenerPedido);
router.post(
  '/',
  validarCookie, validarPrivilegios('admin'),
  validarPedido,
  validarEstadoPedido,
  crearPedido
);
router.put(
  '/:id',
  validarCookie, validarPrivilegios('admin'),
  validarEstadoPedido,
  actualizarPedido
);
router.delete('/:id', validarCookie, validarPrivilegios('admin'), eliminarPedido);

module.exports = router;