const subject = require('../book-api')
const bookStore = require('../book-store')

jest.mock('../book-store')

describe('books-api', () => {
  beforeEach(() => {
    bookStore.getById.mockReset()
    bookStore.searchByTitle.mockReset()
  })

  describe('#get', () => {
    it('returns a wrapped result when found', async () => {
      bookStore.getById.mockResolvedValue({ id: '34', title: 'book-title', tags: 'tag1, tag2' })

      const result = await subject.get('34')

      expect(result).toEqual({ results: [{ id: '34', title: 'book-title', tags: 'tag1, tag2' }] })
      expect(bookStore.getById).toHaveBeenCalledWith('34')
    })

    it('returns an empty wrapped result when not found', async () => {
      bookStore.getById.mockResolvedValue(null)

      const result = await subject.get('404')

      expect(result).toEqual({ results: [] })
      expect(bookStore.getById).toHaveBeenCalledWith('404')
    })
  })

  describe('#searchByTitle', () => {
    it('returns the datastore search results', async () => {
      const rows = [{ id: '1', title: 'The Final Empire', tags: 'fantasy' }]
      bookStore.searchByTitle.mockResolvedValue(rows)

      const result = await subject.searchByTitle('Empire')

      expect(result).toEqual(rows)
      expect(bookStore.searchByTitle).toHaveBeenCalledWith('Empire')
    })
  })
})
