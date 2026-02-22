import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { searchBooksByTitle } from "../api/books"

const sampleTitles = ["Empire", "Cosmos", "Martian", "Twitter"]

export default function Home() {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState([])
  const [searchedTitle, setSearchedTitle] = useState("")
  const requestIdRef = useRef(0)

  useEffect(() => {
    const value = title.trim()

    if (!value) {
      setLoading(false)
      setError("")
      setResults([])
      setSearchedTitle("")
      return
    }

    const timer = setTimeout(async () => {
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      const controller = new AbortController()

      setLoading(true)
      setError("")

      try {
        const books = await searchBooksByTitle(value, { signal: controller.signal })
        if (requestId !== requestIdRef.current) return
        setResults(books)
        setSearchedTitle(value)
      } catch (err) {
        if (err.name === "AbortError") return
        if (requestId !== requestIdRef.current) return
        setError("Search failed. Please try again.")
        setResults([])
        setSearchedTitle(value)
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false)
        }
      }
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [title])

  const runQuickSearch = value => {
    setTitle(value)
  }

  return (
    <section className="card">
      <h1>Find a book</h1>
      <div className="lookup-form">
        <label htmlFor="book-title">Book title</label>
        <input
          id="book-title"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Enter a full or partial title"
        />
        {loading && <p className="search-loading">Searching...</p>}
      </div>
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
      {!loading && searchedTitle && !error && results.length === 0 && searchedTitle === title.trim() && (
        <p className="search-empty">No books found for "{searchedTitle}".</p>
      )}
    </section>
  )
}
