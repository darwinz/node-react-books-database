const createApp = require('./app')
const bookStore = require('./book-store')
const postgres = require('./postgres-client')

const PORT = Number(process.env.PORT || 5000)
const HOST = process.env.HOST || '0.0.0.0'

let server
let shuttingDown = false

async function startup() {
  await initPrimaryStore()

  console.log('Initializing express app...')
  return new Promise(resolve => {
    server = createApp().listen(PORT, HOST, () => {
      const { address, port } = server.address()
      console.log(`Listening at http://${address}:${port}`)
      resolve()
    })
  })
}

async function initPrimaryStore() {
  if (!bookStore.isEnabled()) {
    console.log('Postgres not configured — running in local JSON mode. Set DATABASE_URL or DB_* env variables to enable persistence.')
    return
  }

  console.log('Initializing postgres data store...')
  await bookStore.ensureBooksTable()

  if (process.env.BOOKS_AUTO_SEED === 'false') {
    console.log('Skipping postgres seed (BOOKS_AUTO_SEED=false).')
    return
  }

  const seedResult = await bookStore.seedDefault()
  console.log(`Postgres seed complete (${seedResult.inserted} books upserted).`)
}

async function shutdown() {
  const timeoutInMilliseconds = 5000
  console.log('Attempting to close the http server...')
  await new Promise(resolve => {
    const timeout = setTimeout(() => {
      console.log(`The http server still has not closed after ${timeoutInMilliseconds} milliseconds. Proceeding with a forced shutdown.`)
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
    await postgres.close()
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
