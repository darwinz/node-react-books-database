const ENV = process.env.NODE_ENV || 'local'
let { error, parsed: dotenv } = require('dotenv').config({ path: `.env.${ENV}` })

if (error) {
  dotenv = process.env
}

// Convenience functions
const toBoolean = value => ['true', '1'].includes(value)
const toInt = str => Number.parseInt(str, 10)

// Environment variables
const DB_HOST = dotenv.DB_HOST || 'localhost'
const DB_PORT = toInt(dotenv.DB_PORT || 5432)
const DB_USER = dotenv.DB_USER
const DB_PASSWORD = dotenv.DB_PASSWORD
const DB_NAME = dotenv.DB_NAME
const DB_SCHEMA = dotenv.DB_SCHEMA
const DB_POOL_MAX = toInt(dotenv.DB_POOL_MAX)
const DB_POOL_MIN = toInt(dotenv.DB_POOL_MIN)

const DEBUG = toBoolean(dotenv.DEBUG)

// Calculated config values
const LOCAL = ENV === 'local'
const PROD = ENV === 'production' || ENV === 'prod'

module.exports = {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_POOL_MAX,
  DB_POOL_MIN,
  DB_PORT,
  DB_SCHEMA,
  DB_USER,
  DEBUG,
  ENV,
  LOCAL,
  PROD
}
