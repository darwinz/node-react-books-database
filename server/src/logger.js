const winston = require('winston')
const config = require('./config')

const customFormatter = ({ level, message, timestamp }) => {
  return `[${timestamp} - ${level.toUpperCase()}] ${message}`
}

const configuration = {
  local: {
    level: 'debug',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf(customFormatter)
        )
      })
    ]
  },
  development: {
    level: 'debug',
    transports: [
      new winston.transports.File({
        filename: 'error.log',
        level: 'error'
      }),
      new winston.transports.File({
        filename: 'combined.log',
        level: 'verbose'
      })
    ]
  },
  test: {
    level: 'debug',
    transports: [
      new winston.transports.File({
        filename: 'error.log',
        level: 'error'
      }),
      new winston.transports.File({
        filename: 'combined.log',
        level: 'verbose'
      })
    ]
  },
  production: {
    level: 'error',
    transports: [
      new winston.transports.File({
        filename: 'error.log',
        level: 'error'
      }),
      new winston.transports.File({
        filename: 'combined.log',
        level: 'verbose'
      })
    ]
  }
}

const logger = winston.createLogger(configuration[config.ENV])

module.exports = logger
