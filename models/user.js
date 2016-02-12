var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    user: String,
    password: String,
    email: String,
    firstname: String,
    lastname: String
});
