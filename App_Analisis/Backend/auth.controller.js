 const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createUser, findUserByUsername } = require('../models/user.model')

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await createUser(username, hashedPassword, role)
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await findUserByUsername(username)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' })

    const token = jwt.sign(
      { id: user.id, role: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token, user: { id: user.id, username: user.username, role: user.rol } })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

module.exports = { register, login }

