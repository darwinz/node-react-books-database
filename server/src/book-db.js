const db = require('./sqlite-wrapper')

async function createTable() {
  const statement = `
    create table if not exists books (
      id text primary key,
      title text not null,
      tags text,
      cached_date datetime
    );`

  return db.execute(statement)
}

async function get(bookId) {
  return db.get('select id, title, tags, cached_date from books where id = $id;', { $id: bookId })
}

async function upsert(results) {
  const statement = `
    insert into books (id, title, tags, cached_date)
    values ($id, $title, $tags, $cached_date)
    on conflict(id) do update set title = $title, tags = $tags, cached_date = $cached_date;`

  const book = results && Array.isArray(results.results) ? results.results[0] : results

  if (!book) {
    return null
  }

  return db.execute(statement, {
    $id: book.id,
    $title: book.title,
    $tags: book.tags,
    $cached_date: book.cached_date ? book.cached_date : Date.now()
  })
}

async function invalidateStaleCache() {
  const statement = `
    delete from books
    where cached_date/1000 < CAST(strftime('%s', datetime('now', '-1 day')) as integer)`

  return db.execute(statement)
}

module.exports = {
  createTable,
  get,
  upsert,
  invalidateStaleCache
}
