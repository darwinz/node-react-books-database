const fs = require('fs')
var path = require('path')

async function get(bookId) {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'books-data.json'))
    const parsed = JSON.parse(rawData)
    const results = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.results) ? parsed.results : [])
    const response = { results: [] }
    if (results) {
      const books = results.filter(bk => bk.id === bookId)
      books.forEach(book => {
        response['results'].push({ id: book.id, title: book.title, tags: book.tags })
      })
    }

    return response
  } catch (err) {
    console.log(`Error finding book '${bookId}' from API`, err)
    return null
  }
}

module.exports = {
  get
}
