const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')

class SqliteWrapper {
  constructor() {
    this.db = null
  }

  async connect(dbFilePath) {
    this.db = await sqlite.open({
      filename: dbFilePath,
      driver: sqlite3.Database
    })
  }

  async close() {
    return this.db.close()
  }

  async get(sql, params = {}) {
    return this.db.get(sql, params)
  }

  async execute(sql, params = {}) {
    return this.db.run(sql, params)
  }
}

module.exports = new SqliteWrapper()
