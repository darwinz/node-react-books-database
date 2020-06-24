const bookDb = require('../book-db')
const bookApi = require('../book-api')
const subject = require('../book-cache')

jest.mock('../book-db')
jest.mock('../book-api')

describe('book-cache', () => {
  beforeEach(() => {
    bookDb.get.mockReset()
    bookDb.upsert.mockReset()
    bookApi.get.mockReset()
  })

  describe('#get', () => {
    it('gets data from the db', async () => {
      const book = { id: 'such', title: 'test', tags: 'such, test', cached_date: Date.now() }
      bookDb.get.mockResolvedValue(book)

      const result = await subject.get(book.id)

      expect(result).toEqual(book)
      expect(bookDb.get).toHaveBeenCalledWith(book.id)

      expect(bookDb.upsert).not.toBeCalled()
      expect(bookApi.get).not.toBeCalled()
    })

    describe('when book is not cached', () => {
      describe('when the source of truth returns a value', () => {
        it('gets and saves the book', async () => {
          const book = { id: 'very', title: 'mock', tags: 'very, mock' }
          bookDb.get.mockResolvedValue(null)
          bookApi.get.mockResolvedValue(book)

          const result = await subject.get(book.id)

          expect(result).toEqual(book)
          expect(bookApi.get).toHaveBeenCalledWith(book.id)
          expect(bookDb.upsert).toHaveBeenCalledWith(book)
        })
      })

      describe('when book is cached and should expire', () => {
        it('should get the book from the api and upsert to the cache with new cached date', async () => {
          const book = { id: 'expired', title: 'old', tags: 'expired, old', cached_date: 1577905932000 }
          bookDb.get.mockResolvedValue(book)
          bookApi.get.mockResolvedValue(book)

          const result = await subject.get(book.id)

          expect(result).toEqual(book)
          expect(bookDb.get).toHaveBeenCalledWith(book.id)

          expect(bookApi.get).toHaveBeenCalledWith(book.id)
          expect(bookDb.upsert).toHaveBeenCalledWith(book)
        })
      })

      describe('when the source of truth does not return a value', () => {
        it('does not attempt to save', async () => {
          const bookId = '5'

          bookDb.get.mockResolvedValue(null)
          bookApi.get.mockResolvedValue(null)

          const result = await subject.get(bookId)

          expect(result).toEqual(null)
          expect(bookDb.get).toHaveBeenCalledWith(bookId)
          expect(bookApi.get).toHaveBeenCalledWith(bookId)

          expect(bookDb.upsert).not.toBeCalled()
        })
      })
    })
  })
})
