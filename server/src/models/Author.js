const Sequelize = require('sequelize')
const { db } = require('../db')
const Book = require('./Book')

const Author = db.define('Author', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: Sequelize.STRING,
  password: Sequelize.STRING,
  registeredAt: Sequelize.DATE,
  disabledAt: Sequelize.DATE,
  name: {
    type: Sequelize.VIRTUAL(Sequelize.STRING, ['firstName', 'lastName']),
    get() {
      const names = [this.getDataValue('firstName'), this.getDataValue('lastName')]
      const definedNames = names.filter(name => !!name).map(name => name.trim())
      return definedNames.join(' ')
    }
  }
})

Author.belongsTo(Book, { as: 'author' })
Book.hasMany(Author, { foreignKey: 'bookId' })

module.exports = Author
