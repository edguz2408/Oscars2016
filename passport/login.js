var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
  passport.use('login', new LocalStrategy({
      passReqToCallback: true,
    },
    function(req, username, password, done) {
      User.findOne({
          'user': username
        },
        function(err, user) {

          if (err)
            return done(err)

          if (!user) {
            console.log('User not found');
            return done(null, false, req.flash('message', 'User Not found.'));
          }

          if (!isValidPassword(user, password)) {
            console.log('Invalid password');
            return done(null, false,
              req.flash('message', 'Invalid Password'));
          }

          return done(null, user);

        }
      );
    }));


  var isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password);
  }
}
