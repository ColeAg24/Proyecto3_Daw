// backend/routes/analisis.routes.js
const express = require('express')
const router = express.Router()
const {
  obtenerVentasPorFecha,
  obtenerVentasPorRegion,
  obtenerTopProductosPorCategoria,
  obtenerClientesTop,
  obtenerIngresosPorCategoria
} = require('../controllers/dw.controller')

// Rutas de análisis avanzado
router.get('/ventas-por-fecha', obtenerVentasPorFecha)
router.get('/ventas-por-region', obtenerVentasPorRegion)
router.get('/productos-top-categoria', obtenerTopProductosPorCategoria)
router.get('/clientes-top', obtenerClientesTop)
router.get('/ingresos-por-categoria', obtenerIngresosPorCategoria)

module.exports = router
