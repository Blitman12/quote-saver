const User = require('./User');
const Book = require('./Book');
const Quote = require('./Quote');

//Create all the associations

//User can have many books
User.hasMany(Book, {
    foreignKey: 'user_id'
});

//One Book belongs to a single User
Book.belongsTo(User, {
    foreignKey: 'user_id'
});

//One Quote belongs to
Quote.belongsTo(User, {
    foreignKey: 'user_id'
});

//One user can have many quotes
User.hasMany(Quote, {
    foreignKey: 'user_id'
})

//One Book can have many Quotes
Book.hasMany(Quote, {
    foreignKey: 'book_id'
})

module.exports = { User, Book, Quote }