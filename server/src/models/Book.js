const Sequelize = require('sequelize')
const { db } = require('../db')
const Author = require('./Author')

const Book = db.define('Book', {
  bookId: {
    type: Sequelize.UUID
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: Sequelize.TEXT,
  createdOn: Sequelize.DATE,
  authorId: {
    type: Sequelize.UUID,
    references: {
      model: Author
    },
    onDelete: 'SET NULL'
  },
  indexes: [
    {
      fields: ['bookId']
    },
    {
      fields: ['authorId']
    }
  ]
})

Book.belongsTo(Author, { as: 'book' })
Author.hasMany(Book, { foreignKey: 'authorId' })

module.exports = Book
