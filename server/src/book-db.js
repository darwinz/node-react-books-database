const db = require('./sqlite-wrapper')

async function createTable() {
  await db.execute(`
    create table if not exists books (
      id text primary key,
      title text not null,
      authors text,
      tags text,
      description text,
      cover_url text,
      year integer,
      rating real,
      cached_date datetime
    );`)

  // Non-destructive migrations for columns added after initial schema
  for (const col of [
    'authors text',
    'description text',
    'cover_url text',
    'year integer',
    'rating real',
  ]) {
    await db.execute(`alter table books add column ${col};`).catch(() => {})
  }
}

async function get(bookId) {
  return db.get(
    'select id, title, authors, tags, description, cover_url, year, rating, cached_date from books where id = $id;',
    { $id: bookId }
  )
}

async function upsert(book) {
  if (!book) return null

  return db.execute(
    `insert into books (id, title, authors, tags, description, cover_url, year, rating, cached_date)
     values ($id, $title, $authors, $tags, $description, $cover_url, $year, $rating, $cached_date)
     on conflict(id) do update set
       title = $title, authors = $authors, tags = $tags, description = $description,
       cover_url = $cover_url, year = $year, rating = $rating, cached_date = $cached_date;`,
    {
      $id: book.id,
      $title: book.title,
      $authors: book.authors || null,
      $tags: book.tags || null,
      $description: book.description || null,
      $cover_url: book.cover_url || null,
      $year: book.year || null,
      $rating: book.rating || null,
      $cached_date: book.cached_date || Date.now(),
    }
  )
}

async function invalidateStaleCache() {
  return db.execute(`
    delete from books
    where cached_date/1000 < CAST(strftime('%s', datetime('now', '-1 day')) as integer)`)
}

module.exports = {
  createTable,
  get,
  upsert,
  invalidateStaleCache
}
