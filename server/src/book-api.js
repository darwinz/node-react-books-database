const fs = require('fs')
var path = require('path')

function loadBooks() {
  const rawData = fs.readFileSync(path.join(__dirname, 'books-data.json'))
  const parsed = JSON.parse(rawData)
  return Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.results) ? parsed.results : [])
}

async function get(bookId) {
  try {
    const results = loadBooks()
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

async function searchByTitle(title) {
  try {
    const query = (title || '').trim().toLowerCase()
    if (!query) return []

    const books = loadBooks()
    return books
      .filter(book => book.title && book.title.toLowerCase().includes(query))
      .map(book => ({
        id: book.id,
        title: book.title,
        tags: book.tags
      }))
  } catch (err) {
    console.log(`Error searching books by title '${title}'`, err)
    return null
  }
}

module.exports = {
  get,
  searchByTitle
}
