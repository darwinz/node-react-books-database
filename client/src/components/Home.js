import React, { useState } from "react"
import { Link } from "react-router-dom"
import { searchBooksByTitle } from "../api/books"

const sampleTitles = ["Empire", "Cosmos", "Martian", "Twitter"]

export default function Home() {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState([])

  const submit = async event => {
    event.preventDefault()
    const value = title.trim()
    if (!value) return

    setLoading(true)
    setError("")
    try {
      const books = await searchBooksByTitle(value)
      setResults(books)
    } catch (err) {
      setError("Search failed. Please try again.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const runQuickSearch = async value => {
    setTitle(value)
    setLoading(true)
    setError("")
    try {
      const books = await searchBooksByTitle(value)
      setResults(books)
    } catch (err) {
      setError("Search failed. Please try again.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card">
      <h1>Find a book</h1>
      <form onSubmit={submit} className="lookup-form">
        <label htmlFor="book-title">Book title</label>
        <input
          id="book-title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Enter a full or partial title"
        />
        <button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
      </form>
      <div className="quick-links">
        <p>Quick title searches:</p>
        {sampleTitles.map(sampleTitle => (
          <button
            type="button"
            key={sampleTitle}
            className="quick-link quick-link-button"
            onClick={() => runQuickSearch(sampleTitle)}
          >
            {sampleTitle}
          </button>
        ))}
      </div>
      {error && <p className="search-error">{error}</p>}
      {!loading && results.length > 0 && (
        <ul className="search-results">
          {results.map(book => (
            <li key={book.id}>
              <Link to={`/books/${book.id}`}>{book.title}</Link>
            </li>
          ))}
        </ul>
      )}
      {!loading && title.trim() && !error && results.length === 0 && (
        <p className="search-empty">No books found for "{title}".</p>
      )}
    </section>
  )
}
