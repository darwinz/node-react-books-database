const request = require('supertest')

const createApp = require('../app')
const bookDb = require('../book-db')
const cacheDb = require('../sqlite-wrapper')
const bookApi = require('../book-api')

jest.mock('../book-api')

describe('app', () => {
  let app

  beforeAll(async () => {
    await cacheDb.connect(':cache:')
    await bookDb.createTable()
    app = createApp()
  })
  afterAll(() => {
    return cacheDb.close()
  })

  describe('GET /book/:id', () => {
    it('gets a book by ID', async () => {
      const book = {
        id: '42',
        title: 'ultimate question of life',
        tags: 'fantasy, sci-fi',
        cached_date: Date.now()
      }
      await bookDb.upsert(book)

      const res = await request(app)
        .get(`/books/${book.id}`)
        .send()

      expect(res.status).toEqual(200)
      expect(res.body).toEqual(book)
    })

    describe('when the book does not exist', () => {
      it('returns 404', async () => {
        bookApi.get.mockResolvedValue(null)

        const res = await request(app)
          .get('/books/derp')
          .send()

        expect(res.status).toEqual(404)
      })
    })
  })
})
