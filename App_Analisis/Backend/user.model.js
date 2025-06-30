 const pool = require('../config/db')

const createUser = async (username, hashedPassword, role) => {
  const result = await pool.query(
    'INSERT INTO usuarios (username, password, rol) VALUES ($1, $2, $3) RETURNING *',
    [username, hashedPassword, role]
  )
  return result.rows[0]
}

const findUserByUsername = async (username) => {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE username = $1',
    [username]
  )
  return result.rows[0]
}

module.exports = {
  createUser,
  findUserByUsername
}

