const express = require('express');
const router = express.Router();
const {obtenerDetallesPedido,obtenerDetalle,crearDetalle,actualizarDetalle,eliminarDetalle
} = require('../controllers/detallePedidos.controller');
const validarJWT = require('../middleware/validarJWT');
const validarPrivilegios = require('../middleware/validarPrivilegios');
const { validarDetallePedido } = require('../middleware/validarDetallePedido');

router.get('/pedido/:idPedido', validarJWT, validarPrivilegios('admin'), obtenerDetallesPedido);
router.get('/:id', validarJWT, validarPrivilegios('admin'), obtenerDetalle);
router.post(
  '/',
  validarJWT,
  validarPrivilegios('admin'),
  validarDetallePedido,
  crearDetalle
);
router.put(
  '/:id',
  validarJWT,
  validarPrivilegios('admin'),
  validarDetallePedido,
  actualizarDetalle
);
router.delete('/:id', validarJWT, validarPrivilegios('admin'), eliminarDetalle);

module.exports = router;