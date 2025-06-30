const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas existentes
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');
const dwRoutes = require('./routes/dw.routes'); // NUEVO

// 🟦 Nueva ruta para análisis
const analisisRoutes = require('./routes/analisis.routes');

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/dw', dwRoutes); // NUEVO

// 🟦 Usar las rutas de análisis
app.use('/api/analisis', analisisRoutes);

module.exports = app;
