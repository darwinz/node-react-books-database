const request = require('supertest')
const createApp = require('../app')
const bookApi = require('../book-api')

jest.mock('../book-api')

describe('app', () => {
  let app

  beforeAll(() => {
    app = createApp()
  })

  beforeEach(() => {
    bookApi.get.mockReset()
    bookApi.searchByTitle.mockReset()
  })

  describe('GET /books/:id', () => {
    it('gets a book by ID', async () => {
      const book = {
        id: '42',
        title: 'ultimate question of life',
        authors: 'Douglas Adams',
        tags: 'fantasy, sci-fi',
        description: 'A comedic space adventure.',
        cover_url: null,
        year: null,
        rating: null,
      }
      bookApi.get.mockResolvedValue(book)

      const res = await request(app).get('/books/42').send()

      expect(res.status).toEqual(200)
      expect(res.body).toEqual(book)
      expect(bookApi.get).toHaveBeenCalledWith('42')
    })

    describe('when the book does not exist', () => {
      it('returns 404', async () => {
        bookApi.get.mockResolvedValue(null)

        const res = await request(app).get('/books/derp').send()

        expect(res.status).toEqual(404)
      })
    })
  })

  describe('GET /books', () => {
    it('returns search results', async () => {
      const results = [{ id: '1', title: 'The Final Empire', authors: 'Brandon Sanderson' }]
      bookApi.searchByTitle.mockResolvedValue(results)

      const res = await request(app).get('/books?title=empire').send()

      expect(res.status).toEqual(200)
      expect(res.body).toEqual(results)
      expect(bookApi.searchByTitle).toHaveBeenCalledWith('empire')
    })

    it('returns an empty array when no title is given', async () => {
      const res = await request(app).get('/books').send()

      expect(res.status).toEqual(200)
      expect(res.body).toEqual([])
    })
  })
})
