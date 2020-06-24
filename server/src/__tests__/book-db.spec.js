const subject = require('../book-db')
const cacheDb = require('../sqlite-wrapper')

describe('book-db', () => {
  beforeAll(async () => {
    await cacheDb.connect(':cache:')
    return subject.createTable()
  })
  afterAll(() => {
    return cacheDb.close()
  })

  describe('#get', () => {
    it('gets the book from the repo', async () => {
      const book = { id: 'rick', title: 'morty', tags: 'rick, morty', cached_date: Date.now() }
      await subject.upsert(book)

      const result = await subject.get(book.id)

      expect(result).toEqual(book)
    })
  })

  describe('#upsert', () => {
    it('updates existing book data', async () => {
      const book = { id: 'peter', title: 'griffin', tags: 'peter, griffin', cached_date: Date.now() }
      await subject.upsert(book)
      book.title = 'family guy'

      await subject.upsert(book)
      const result = await subject.get(book.id)

      expect(result).toEqual(book)
    })
  })
})
