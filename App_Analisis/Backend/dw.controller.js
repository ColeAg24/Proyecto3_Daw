// backend/controllers/dw.controller.js 
const pool = require('../config/db')

// ========== RESUMEN GENERAL ==========
const obtenerResumen = async (req, res) => {
  try {
    const totalVentasResult = await pool.query('SELECT SUM(total) AS total FROM ventas')
    const totalVentas = parseFloat(totalVentasResult.rows[0].total) || 0

    const clientesResult = await pool.query('SELECT COUNT(DISTINCT cliente_id) AS total FROM ventas')
    const clientesActivos = parseInt(clientesResult.rows[0].total) || 0

    const productosResult = await pool.query(`
      SELECT p.nombre, SUM(v.cantidad) AS cantidad
      FROM ventas v
      JOIN productos p ON v.producto_id = p.id
      GROUP BY p.nombre
      ORDER BY cantidad DESC
      LIMIT 3
    `)

    const productosMasVendidos = productosResult.rows.map(p => ({
      nombre: p.nombre,
      cantidad: parseInt(p.cantidad)
    }))

    res.json({
      mensaje: 'Resumen consultado con éxito',
      datos: {
        totalVentas,
        clientesActivos,
        productosMasVendidos
      }
    })
  } catch (error) {
    console.error('Error en obtenerResumen:', error)
    res.status(500).json({ error: 'Error al consultar el resumen' })
  }
}

// ========== VENTAS POR PRODUCTO ==========
const obtenerVentasPorProducto = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.nombre, SUM(v.total) AS total
      FROM ventas v
      JOIN productos p ON p.id = v.producto_id
      GROUP BY p.nombre
      ORDER BY total DESC
    `)

    const datos = result.rows.map(row => ({
      nombre: row.nombre,
      total: parseFloat(row.total)
    }))

    res.json(datos)
  } catch (error) {
    console.error('Error en obtenerVentasPorProducto:', error)
    res.status(500).json({ error: 'Error al consultar ventas por producto' })
  }
}

// ========== VENTAS POR FECHA ==========
const obtenerVentasPorFecha = async (req, res) => {
  try {
    const { tipo = 'mes' } = req.query
    const formato = tipo === 'anio' ? 'YYYY' : 'YYYY-MM'
    const result = await pool.query(`
      SELECT TO_CHAR(fecha, '${formato}') AS periodo, SUM(total) AS total
      FROM ventas
      GROUP BY periodo
      ORDER BY periodo
    `)

    res.json(result.rows)
  } catch (error) {
    console.error('Error en obtenerVentasPorFecha:', error)
    res.status(500).json({ error: 'Error al consultar ventas por fecha' })
  }
}

// ========== VENTAS POR REGIÓN (CORREGIDO) ==========
const obtenerVentasPorRegion = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.region, SUM(v.total) AS total
      FROM ventas v
      JOIN clientes c ON v.cliente_id = c.id
      GROUP BY c.region
      ORDER BY total DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error('Error en obtenerVentasPorRegion:', error)
    res.status(500).json({ error: 'Error al consultar ventas por región' })
  }
}

// ========== PRODUCTOS TOP POR CATEGORÍA ==========
const obtenerTopProductosPorCategoria = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT categoria, nombre, SUM(cantidad) AS total
      FROM productos p
      JOIN ventas v ON v.producto_id = p.id
      GROUP BY categoria, nombre
      ORDER BY categoria, total DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error('Error en obtenerTopProductosPorCategoria:', error)
    res.status(500).json({ error: 'Error al consultar productos top por categoría' })
  }
}

// ========== CLIENTES TOP ==========
const obtenerClientesTop = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.nombre, COUNT(v.id) AS compras, SUM(v.total) AS total
      FROM clientes c
      JOIN ventas v ON v.cliente_id = c.id
      GROUP BY c.nombre
      ORDER BY total DESC
      LIMIT 5
    `)

    res.json(result.rows)
  } catch (error) {
    console.error('Error en obtenerClientesTop:', error)
    res.status(500).json({ error: 'Error al consultar clientes top' })
  }
}

// ========== INGRESOS POR CATEGORÍA ==========
const obtenerIngresosPorCategoria = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT categoria, SUM(v.total) AS ingresos
      FROM productos p
      JOIN ventas v ON v.producto_id = p.id
      GROUP BY categoria
      ORDER BY ingresos DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error('Error en obtenerIngresosPorCategoria:', error)
    res.status(500).json({ error: 'Error al consultar ingresos por categoría' })
  }
}

module.exports = {
  obtenerResumen,
  obtenerVentasPorProducto,
  obtenerVentasPorFecha,
  obtenerVentasPorRegion,
  obtenerTopProductosPorCategoria,
  obtenerClientesTop,
  obtenerIngresosPorCategoria
}
