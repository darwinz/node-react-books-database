import React from "react"
import "./App.css"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Book from "./components/Book"
import Home from "./components/Home"

export default function App() {
  return (
    <Router>
      <div className="app-shell">
        <header className="app-header">
          <Link to="/" className="app-logo">Books Database</Link>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/books/:id" element={<Book />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
