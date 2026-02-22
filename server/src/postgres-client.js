const { Pool } = require('pg')
const config = require('./config')

let pool

function isEnabled() {
  return Boolean(config.DATABASE_URL || (config.DB_HOST && config.DB_USER && config.DB_NAME))
}

function getConnectionConfig() {
  if (config.DATABASE_URL) {
    return {
      connectionString: config.DATABASE_URL,
      ssl: config.DB_SSL ? { rejectUnauthorized: false } : false
    }
  }

  return {
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    ssl: config.DB_SSL ? { rejectUnauthorized: false } : false
  }
}

function getPool() {
  if (!pool) {
    pool = new Pool(getConnectionConfig())
  }

  return pool
}

async function query(text, params = []) {
  return getPool().query(text, params)
}

async function close() {
  if (!pool) return
  await pool.end()
  pool = null
}

module.exports = {
  close,
  isEnabled,
  query
}
