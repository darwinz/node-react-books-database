const bookStore = require('./book-store')
const postgres = require('./postgres-client')

async function seed() {
  if (!bookStore.isEnabled()) {
    throw new Error('Postgres is not configured. Set DATABASE_URL or DB_* env variables.')
  }

  await bookStore.ensureBooksTable()
  const result = await bookStore.seedDefault()

  if (result.skipped) {
    console.log(`Seed skipped: books table already has ${result.total} records.`)
  } else {
    console.log(`Seed complete: inserted ${result.inserted} books.`)
  }
}

seed()
  .catch(err => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await postgres.close()
  })
