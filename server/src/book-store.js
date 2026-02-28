const fs = require('fs')
const path = require('path')
const postgres = require('./postgres-client')
const SEED_FILE_PATH = path.join(__dirname, '../db/seeds/books.json')

function isEnabled() {
  return postgres.isEnabled()
}

async function ensureBooksTable() {
  await postgres.query(`
    create table if not exists books (
      id text primary key,
      title text not null,
      authors text,
      tags text,
      description text,
      cover_url text,
      year integer,
      rating numeric(3,1)
    );
  `)

  await postgres.query(`
    create index if not exists books_title_idx on books (lower(title));
  `)

  // Non-destructive migrations for the new columns on existing tables
  for (const col of [
    'cover_url text',
    'year integer',
    'rating numeric(3,1)',
  ]) {
    const [name] = col.split(' ')
    await postgres.query(
      `alter table books add column if not exists ${name} ${col.slice(name.length + 1)};`
    )
  }
}

async function getById(bookId) {
  const { rows } = await postgres.query(
    'select id, title, authors, tags, description, cover_url, year, rating from books where id = $1 limit 1;',
    [bookId]
  )
  return rows[0] || null
}

async function searchByTitle(title) {
  const query = (title || '').trim()
  if (!query) return []

  const { rows } = await postgres.query(
    `
      select id, title, authors, tags, cover_url, year, rating
      from books
      where lower(title) like lower($1)
      order by title asc
      limit 50;
    `,
    [`%${query}%`]
  )

  return rows
}

async function seedFromFile(jsonPath) {
  const parsed = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const books = Array.isArray(parsed) ? parsed : []

  for (const book of books) {
    await postgres.query(
      `
        insert into books (id, title, authors, tags, description, cover_url, year, rating)
        values ($1, $2, $3, $4, $5, $6, $7, $8)
        on conflict(id) do update
          set title       = excluded.title,
              authors     = excluded.authors,
              tags        = excluded.tags,
              description = excluded.description,
              cover_url   = excluded.cover_url,
              year        = excluded.year,
              rating      = excluded.rating;
      `,
      [
        book.id,
        book.title,
        book.authors || null,
        book.tags || null,
        book.description || null,
        book.coverUrl || null,
        book.year || null,
        book.rating || null,
      ]
    )
  }

  return { inserted: books.length, total: books.length }
}

async function seedDefault() {
  return seedFromFile(SEED_FILE_PATH)
}

module.exports = {
  ensureBooksTable,
  getById,
  isEnabled,
  seedDefault,
  seedFromFile,
  searchByTitle
}
