// backend/routes/protected.routes.js
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: 'Acceso autorizado al panel de análisis',
    user: req.user
  })
})

module.exports = router
