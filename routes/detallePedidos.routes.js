const express = require('express');
const router = express.Router();
const {obtenerDetallesPedido,obtenerDetalle,crearDetalle,actualizarDetalle,eliminarDetalle
} = require('../controllers/detallePedidos.controller');
const validarCookie = require('../middleware/validarCookie');
const validarPrivilegios = require('../middleware/validarPrivilegios');
const { validarDetallePedido } = require('../middleware/validarDetallePedido');

router.get('/pedido/:idPedido', validarCookie, validarPrivilegios('admin'), obtenerDetallesPedido);
router.get('/:id', validarCookie, validarPrivilegios('admin'), obtenerDetalle);
router.post(
  '/',
  validarCookie,
  validarPrivilegios('admin'),
  validarDetallePedido,
  crearDetalle
);
router.put(
  '/:id',
  validarCookie,
  validarPrivilegios('admin'),
  validarDetallePedido,
  actualizarDetalle
);
router.delete('/:id', validarCookie, validarPrivilegios('admin'), eliminarDetalle);

module.exports = router;