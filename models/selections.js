var mongoose = require('mongoose');

module.exports = mongoose.model('selections', {
  "currentCategory" : String,
  "selection" : String
});
