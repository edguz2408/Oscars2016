var mongoose = require('mongoose');

module.exports = mongoose.model('Choices', {
  "user" : String,
  "selections" : []
});
