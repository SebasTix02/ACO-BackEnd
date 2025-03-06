const express = require('express');
const router = express.Router();
const {obtenerPedidos,obtenerPedido,crearPedido,actualizarPedido,eliminarPedido,obtenerPedidosPorEstado
} = require('../controllers/pedidos.controller');
const validarJWT = require('../middleware/validarJWT');
const validarPrivilegios = require('../middleware/validarPrivilegios');
const { validarPedido, validarEstadoPedido } = require('../middleware/validarPedido');

router.get('/', validarJWT, validarPrivilegios('admin'), obtenerPedidos);
router.get('/estado/:estado', validarJWT, validarPrivilegios('admin'), obtenerPedidosPorEstado);
router.get('/:id', validarJWT, validarPrivilegios('admin'), obtenerPedido);
router.post(
  '/',
  validarJWT, validarPrivilegios('admin'),
  validarPedido,
  validarEstadoPedido,
  crearPedido
);
router.put(
  '/:id',
  validarJWT, validarPrivilegios('admin'),
  validarEstadoPedido,
  actualizarPedido
);
router.delete('/:id', validarJWT, validarPrivilegios('admin'), eliminarPedido);

module.exports = router;