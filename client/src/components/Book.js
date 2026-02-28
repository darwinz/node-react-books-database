import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { fetchBookById } from "../api/books"

export default function Book() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showTags, setShowTags] = useState(false)

  useEffect(() => {
    let isSubscribed = true
    const controller = new AbortController()

    setLoading(true)
    setError("")
    setBook(null)
    setShowTags(false)

    fetchBookById(id, { signal: controller.signal })
      .then(result => {
        if (!isSubscribed) return
        setBook(result)
      })
      .catch(err => {
        if (!isSubscribed || err.name === "AbortError") return
        setError("We couldn't load this book right now.")
      })
      .finally(() => {
        if (!isSubscribed) return
        setLoading(false)
      })

    return () => {
      isSubscribed = false
      controller.abort()
    }
  }, [id])

  const tags = book && book.tags ? book.tags.split(",").map(tag => tag.trim()) : []

  if (loading) {
    return <div className="card">Loading book {id}...</div>
  }

  if (error) {
    return (
      <div className="card">
        <p>{error}</p>
        <Link to="/">Back home</Link>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="card">
        <h2>Book not found</h2>
        <p>There is no book with id {id}.</p>
        <Link to="/">Try another id</Link>
      </div>
    )
  }

  return (
    <article className="card book-detail">
      {book.cover_url && (
        <img
          className="book-detail-cover"
          src={book.cover_url}
          alt={`Cover of ${book.title}`}
        />
      )}
      <div className="book-detail-body">
        <h2>{book.title}</h2>
        {book.authors && <p><strong>Authors:</strong> {book.authors}</p>}
        {book.year && <p><strong>Year:</strong> {book.year}</p>}
        {book.rating && <p><strong>Rating:</strong> {book.rating} / 10</p>}
        {book.description && <p><strong>Description:</strong> {book.description}</p>}
        <div className="tags-row">
          <button type="button" className="tags-toggle" onClick={() => setShowTags(!showTags)}>
            {showTags ? "Hide tags" : "Show tags"}
          </button>
          {showTags && (
            <ul className="tags">
              {tags.map(tag => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </div>
        <Link to="/">Back home</Link>
      </div>
    </article>
  )
}
