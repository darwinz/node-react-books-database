const subject = require('../book-api')
const bookStore = require('../book-store')

jest.mock('../book-store')

describe('book-api', () => {
  beforeEach(() => {
    bookStore.isEnabled.mockReturnValue(true)
    bookStore.getById.mockReset()
    bookStore.searchByTitle.mockReset()
  })

  describe('#get', () => {
    it('returns the book when found', async () => {
      const book = { id: '34', title: 'book-title', tags: 'tag1, tag2' }
      bookStore.getById.mockResolvedValue(book)

      const result = await subject.get('34')

      expect(result).toEqual(book)
      expect(bookStore.getById).toHaveBeenCalledWith('34')
    })

    it('returns null when not found', async () => {
      bookStore.getById.mockResolvedValue(null)

      const result = await subject.get('404')

      expect(result).toBeNull()
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
