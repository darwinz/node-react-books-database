/**
 * Enrich books-data.json with cover image URLs and ratings from Open Library.
 *
 * Usage:  node server/scripts/enrich-books.js
 *
 * For each book it:
 *   1. Searches Open Library by title + first author
 *   2. Pulls the cover_i (cover ID) and first_publish_year from the best match
 *   3. Writes coverUrl and (if missing) a seeded rating into both JSON files:
 *        server/src/books-data.json
 *        server/db/seeds/books.json
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

const SEEDS_PATH = path.join(__dirname, '../db/seeds/books.json')

// Deterministic pseudo-rating seeded from the book id so re-runs are stable.
function seedRating(id) {
  const n = Number(id) || id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return Math.round((6.0 + (n % 35) / 10) * 10) / 10
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'books-database-enrich/1.0' } }, res => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)) }
      })
    }).on('error', reject)
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function enrichBook(book) {
  const firstAuthor = (book.authors || '').split(',')[0].trim()
  const query = encodeURIComponent(`${book.title} ${firstAuthor}`.trim())
  const url = `https://openlibrary.org/search.json?q=${query}&fields=key,title,cover_i,first_publish_year&limit=1`

  try {
    const data = await fetch(url)
    const hit = data.docs && data.docs[0]

    return {
      ...book,
      coverUrl: hit && hit.cover_i
        ? `https://covers.openlibrary.org/b/id/${hit.cover_i}-L.jpg`
        : null,
      year: book.year || (hit && hit.first_publish_year) || null,
      rating: book.rating || seedRating(book.id),
    }
  } catch (err) {
    console.warn(`  ⚠  Could not fetch cover for "${book.title}": ${err.message}`)
    return { ...book, coverUrl: null, year: book.year || null, rating: book.rating || seedRating(book.id) }
  }
}

async function main() {
  const books = JSON.parse(fs.readFileSync(SEEDS_PATH, 'utf8'))
  const enriched = []

  console.log(`Enriching ${books.length} books …\n`)

  for (let i = 0; i < books.length; i++) {
    const book = books[i]
    process.stdout.write(`[${i + 1}/${books.length}] ${book.title} … `)
    const result = await enrichBook(book)
    enriched.push(result)
    console.log(result.coverUrl ? 'OK' : 'no cover')
    // Be polite to Open Library's API
    await sleep(300)
  }

  fs.writeFileSync(SEEDS_PATH, JSON.stringify(enriched, null, 2))

  const withCover = enriched.filter(b => b.coverUrl).length
  console.log(`\nDone. ${withCover}/${enriched.length} books have cover images.`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
