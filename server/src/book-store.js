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
      description text
    );
  `)

  await postgres.query(`
    create index if not exists books_title_idx on books (lower(title));
  `)
}

async function getById(bookId) {
  const { rows } = await postgres.query(
    'select id, title, authors, tags, description from books where id = $1 limit 1;',
    [bookId]
  )
  return rows[0] || null
}

async function searchByTitle(title) {
  const query = (title || '').trim()
  if (!query) return []

  const { rows } = await postgres.query(
    `
      select id, title, tags
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
  const countResult = await postgres.query('select count(*)::int as count from books;')
  const existingCount = countResult.rows[0].count

  if (existingCount > 0) {
    return { inserted: 0, skipped: true, total: existingCount }
  }

  const parsed = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const books = Array.isArray(parsed) ? parsed : []

  for (const book of books) {
    await postgres.query(
      `
        insert into books (id, title, authors, tags, description)
        values ($1, $2, $3, $4, $5)
        on conflict(id) do update
          set title = excluded.title,
              authors = excluded.authors,
              tags = excluded.tags,
              description = excluded.description;
      `,
      [book.id, book.title, book.authors || null, book.tags || null, book.description || null]
    )
  }

  return { inserted: books.length, skipped: false, total: books.length }
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
