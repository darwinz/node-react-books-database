import React from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom"
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
          <Switch>
            <Route path="/books/:id" component={Book} />
            <Route exact path="/" component={Home} />
          </Switch>
        </main>
      </div>
    </Router>
  )
}
