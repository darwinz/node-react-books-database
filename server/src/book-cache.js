const bookDb = require('./book-db')
const bookApi = require('./book-api')

async function get(bookId) {
  const result = await bookDb.get(bookId)

  if (result && (Date.now() - result.cached_date) / 1000 < 86400) {
    let response = { results: [] }
    response['results'].push(result)
    return response
  }

  const results = await bookApi.get(bookId)

  if (results) {
    await bookDb.upsert(results)
  }

  return results
}

module.exports = {
  get
}
