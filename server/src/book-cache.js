const bookDb = require('./book-db')
const bookApi = require('./book-api')

async function get(bookId) {
  const result = await bookDb.get(bookId)

  if (result && (Date.now() - result.cached_date) / 1000 < 86400) {
    return result
  }

  const results = await bookApi.get(bookId)
  const book = results && Array.isArray(results.results) ? results.results[0] : results

  if (book) {
    await bookDb.upsert(book)
  }

  return book || null
}

module.exports = {
  get
}
