const express = require('express')
const cors = require('cors')

const bookApi = require('./book-api')

function notFound(req, res, next) {
  next(new Error(`There's nothing here at '${req.url}'`))
}

function logErrors(err, req, res, next) {
  console.error(err)
  next(err)
}

function catchAll(err, req, res) {
  const status = err.status || 500
  res.status(status).json({ error: err.message })
}

function wrapAsyncRoute(asyncRoute) {
  return function routeWrapper(req, res, next) {
    return asyncRoute(req, res, next).catch(next)
  }
}

async function getBook(req, res) {
  const book = await bookApi.get(req.params.id)
  if (book) {
    res.status(200).json(book)
  } else {
    res.sendStatus(404)
  }
}

async function searchBooks(req, res) {
  const title = req.query.title
  if (!title) {
    res.status(200).json([])
    return
  }

  const results = await bookApi.searchByTitle(title)
  if (results === null) {
    res.sendStatus(500)
    return
  }

  res.status(200).json(results)
}

module.exports = () => {
  const app = express()

  app.use(cors())

  app.get('/books', wrapAsyncRoute(searchBooks))
  app.get('/books/:id', wrapAsyncRoute(getBook))

  app.use(notFound)
  app.use(logErrors)
  app.use(catchAll)

  return app
}
