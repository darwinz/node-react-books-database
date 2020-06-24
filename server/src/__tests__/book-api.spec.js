const subject = require('../book-api')
const axios = require('axios')

jest.mock('fs')
jest.mock('axios')

const fs = require('fs')

const MOCK_FILE_INFO = {
  '../books-data.json': { results: [{id: '34', title: 'book-title', description: 'amazing book', tags: 'tag1, tag2'}] },
}

describe('books-api', () => {
  beforeEach(() => {
    axios.get.mockReset()
  })

  describe('#get', () => {
    it('maps the response', async () => {
      fs.mock_file_info(MOCK_FILE_INFO)
      fs.readFileSync()
      // const res = { data: { title: 'book-title', description: 'amazing book', tags: 'tag1, tag2' } }
      const res = MOCK_FILE_INFO['../books-data.json']['results'][0]
      axios.get.mockResolvedValue(res)

      const book = await subject.get('34')

      expect(book['results'][0]).toEqual({ id: '34', title: res.title, tags: res.tags })
    })

    describe('on a non-200 response', () => {
      it('returns null', async () => {
        fs.mock_file_info({'../books-data.json':
            { results: [{id: '20', title: 'test', description: 'testing', tags: 'tags'}] } })
        fs.readFileSync()
        axios.get.mockRejectedValue({ status: '404' })

        const book = await subject.get('34')

        expect(book['results']).toEqual([])
      })
    })
  })
})
