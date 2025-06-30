const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  obtenerResumen,
  obtenerVentasPorProducto
} = require('../controllers/dw.controller');

// Ruta para el resumen general
router.get('/resumen', verifyToken, obtenerResumen);

// ✅ Nueva ruta para obtener ventas por producto (para la gráfica)
router.get('/ventas-por-producto', verifyToken, obtenerVentasPorProducto);

module.exports = router;
