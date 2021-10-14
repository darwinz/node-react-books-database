const createApp = require('./app')
const db = require('./sqlite-wrapper')
const bookDb = require('./book-db')

let server
let shuttingDown = false


async function startup() {
  console.log('Initializing db...')
  await db.connect('cache.db')
  await bookDb.createTable()

  console.log('Initializing express app...')
  return new Promise(resolve => {
    server = createApp().listen(5000, '0.0.0.0', async () => {
      const { address, port } = server.address()
      console.log(`Listening at http://${address}:${port}`)
      resolve()
    })
  })
}

async function shutdown() {
  const timeoutInMilliseconds = 5000
  console.log('Attempting to close the http server...')
  await new Promise(resolve => {
    const timeout = setTimeout(() => {
      console.log(`The http server still has not closed after ${timeoutInMilliseconds} milliseconds. This is likely because of sockets still being open. Proceeding with a forced shutdown.`)
      resolve()
    }, timeoutInMilliseconds)

    server.close(() => {
      clearTimeout(timeout)
      console.log('Http server closed gracefully')
      resolve()
    })
  })
}

async function shutdownDb() {
  console.log('Attempting to close db connection...')

  try {
    await db.close()
    console.log('Db connection closed')
  } catch (err) {
    console.error('An error occurred while shutting down the db', err)
  }
}

async function gracefulShutdown() {
  if (shuttingDown) return
  shuttingDown = true

  console.log('Attempting graceful shutdown...')
  await shutdown()
  await shutdownDb()
  setTimeout(() => process.exit(0), 20)
}

function handleError(error) {
  console.error(error)
  process.nextTick(() => process.exit(1))
}

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

startup().catch(err => console.error('Failed to start server', err))
