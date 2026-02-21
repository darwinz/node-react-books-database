import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"

const sampleIds = ["1", "2", "7", "17"]

export default function Home() {
  const history = useHistory()
  const [bookId, setBookId] = useState("")

  const submit = event => {
    event.preventDefault()
    const value = bookId.trim()
    if (!value) return
    history.push(`/books/${value}`)
  }

  return (
    <section className="card">
      <h1>Find a book</h1>
      <form onSubmit={submit} className="lookup-form">
        <label htmlFor="book-id">Book ID</label>
        <input
          id="book-id"
          value={bookId}
          onChange={event => setBookId(event.target.value)}
          placeholder="Enter an id, e.g. 1"
        />
        <button type="submit">Load book</button>
      </form>
      <div className="quick-links">
        <p>Quick picks:</p>
        {sampleIds.map(id => (
          <Link key={id} to={`/books/${id}`} className="quick-link">
            {id}
          </Link>
        ))}
      </div>
    </section>
  )
}
