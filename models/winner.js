var mongoose = require('mongoose');

module.exports = mongoose.model('winner', {
  "category": String,
  "winner": String,
  "price": Number,
  "amount": Number,
  "voters": Number
});
