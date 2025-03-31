const express = require('express');
const router = express.Router();
const { obtenerClientesFrecuentes, obtenerPicosDemanda,obtenerPatronesConsumo, obtenerKPIs, obtenerDistribucionVentas } = require('../controllers/dashboard.controller');
const validarCookie = require('../middleware/validarCookie');
const validarPrivilegios = require('../middleware/validarPrivilegios');

// Ruta POST para obtener estadísticas
router.post(
    '/clientesFrecuentes',
    validarCookie,
    validarPrivilegios('admin'), // Ajustar el privilegio necesario
    obtenerClientesFrecuentes
);
router.post(
    '/picosDemanda',
    validarCookie,
    validarPrivilegios('admin'),
    obtenerPicosDemanda
);
router.post(
    '/patronesConsumo',
    validarCookie,
    validarPrivilegios('analista'),
    obtenerPatronesConsumo
);

router.post(
    '/kpis',
    validarCookie,
    validarPrivilegios('gerente'),
    obtenerKPIs
);

router.post(
    '/distribucionVentas',
    validarCookie,
    validarPrivilegios('analista'),
    obtenerDistribucionVentas
);
module.exports = router;