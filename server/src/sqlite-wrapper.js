const sqlite = require('sqlite')

class SqliteWrapper {
  constructor() {
    this.db = null
  }

  async connect(dbFilePath) {
    this.db = await sqlite.open(dbFilePath)
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
