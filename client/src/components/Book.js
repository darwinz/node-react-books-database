import React from "react"

export default class Book extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      book: null,
      showTags: false,
    }
    this.toggleTags = this.toggleTags.bind(this)
  }

  toggleTags() {
    this.setState({ showTags: !this.state.showTags } )
  }

  componentDidMount() {
    fetch(`http://localhost:5000/books/${this.props.bookId}`)
      .then(res => res.json())
      .then(results => this.setState({ book: results['results'][0] }))
  }

  render() {
    return (
      <div>
        {this.state.book ? (
          <ul className="book">
            <li><strong>ID:</strong> {this.state.book.id}</li>
            <li><strong>Title:</strong> {this.state.book.title}</li>
            <li>
              <div className="tags-toggle" onClick={this.toggleTags}>
                <strong>Tags:</strong>
            { this.state.showTags && this.state.book.tags ? (
              <ul className="tags">
                { this.state.book.tags.split(',').map(tag => <li key={tag}>{tag}</li>) }
              </ul>
            ) :
              ( <span className="ellipses tags-toggle" onClick={this.toggleTags}>
                  <strong> ...</strong>
                </span> )
            }
              </div>
            </li>
          </ul>
        ) : (
          <div>Loading</div>
        )}
      </div>
    )
  }
}
