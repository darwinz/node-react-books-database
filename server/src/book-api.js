const fs = require('fs')
const path = require('path')
const bookStore = require('./book-store')

const JSON_PATH = path.join(__dirname, '../db/seeds/books.json')

function readJsonBooks() {
  try {
    return JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'))
  } catch {
    return []
  }
}

async function get(bookId) {
  try {
    if (bookStore.isEnabled()) {
      return bookStore.getById(bookId)
    }
    return readJsonBooks().find(b => b.id === bookId) || null
  } catch (err) {
    console.log(`Error finding book '${bookId}'`, err)
    return null
  }
}

async function searchByTitle(title) {
  try {
    if (bookStore.isEnabled()) {
      return bookStore.searchByTitle(title)
    }
    const query = (title || '').trim().toLowerCase()
    if (!query) return []
    return readJsonBooks().filter(b => b.title.toLowerCase().includes(query))
  } catch (err) {
    console.log(`Error searching books by title '${title}'`, err)
    return null
  }
}

module.exports = {
  get,
  searchByTitle
}
