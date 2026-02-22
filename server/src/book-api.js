const bookStore = require('./book-store')

async function get(bookId) {
  try {
    const book = await bookStore.getById(bookId)
    return { results: book ? [book] : [] }
  } catch (err) {
    console.log(`Error finding book '${bookId}' from API`, err)
    return null
  }
}

async function searchByTitle(title) {
  try {
    return bookStore.searchByTitle(title)
  } catch (err) {
    console.log(`Error searching books by title '${title}'`, err)
    return null
  }
}

module.exports = {
  get,
  searchByTitle
}
