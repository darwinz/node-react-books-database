const Sequelize = require('sequelize')
const config = require('./config')
const logger = require('./logger')

const pgConfig = {
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

const sequelize = new Sequelize(pgConfig.database, pgConfig.user, pgConfig.password, {
  host: pgConfig.host,
  dialect: pgConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: pgConfig.pool.max,
    min: pgConfig.pool.min,
    acquire: pgConfig.pool.acquire,
    idle: pgConfig.pool.idle
  }
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.authenticate().catch(error => {
  logger.error(`Unable to connect to database: ${error}`)
})

module.exports = {
  db
}
