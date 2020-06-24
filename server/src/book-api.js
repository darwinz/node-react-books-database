const fs = require('fs')
var path = require('path')

async function get(bookId) {
  try {
    let rawData = fs.readFileSync(path.join(__dirname, 'books-data.json'))
    let results = JSON.parse(rawData)
    let response = { results: [] }
    if (results) {
      let books = results.filter(bk => bk.id === bookId)
      books.forEach( book => {
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
