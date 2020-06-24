import React from "react"
import "./App.css"
import Book from "./components/Book";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      book: null
    }
  }

  render() {
    return (
      <Router>
        <Route path='/books/:id' component={ (props) => <Book bookId={props.match.params.id} /> } />
        <Route exact path='/' component={ () => <Home /> } />
      </Router>
    )
  }
}
