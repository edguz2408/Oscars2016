var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    user: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String
});
