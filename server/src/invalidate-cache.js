const cacheDb = require('./book-db')
const db = require('./sqlite-wrapper')

const invalidateCache = async () => {
  console.log('Initializing db...')
  await db.connect('cache.db')

  console.log('Invalidating stale cache...')
  await cacheDb.invalidateStaleCache()
}

invalidateCache()
.then(() => {
  console.log('Finished invalidating stale cache...')
})
.catch(err => {
  console.error(err)
})
