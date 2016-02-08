var express = require('express');
var router = express.Router();
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var Choices = require('../models/Choices');
var Nominations = require('../models/Nominations')

var GOOGLE_CLIENT_ID = "--insert-google-client-id-here--",
  GOOGLE_CLIENT_SECRET = "--insert-google-client-secret-here--";

module.exports = router;

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

module.exports = function(passport) {

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('login', {
      message: req.flash('message')
    });
  });

  /* Handle Logout */
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/signup', function(req, res) {
    res.render('signup', {
      message: req.flash('message')
    });
  });

  router.get('/home', isAuthenticated, function(req, res) {
    console.log(req.user);
    res.render('index', {
      user: req.user
    });
  });

  router.get('/getData', function(req, res) {
    Nominations.find({}, function(err, nominations) {
      if (!err) {
        console.log(nominations);
        res.json(nominations);
      } else {
        console.log(err);
      }

    });

  });

  router.get('/choicesdata', isAuthenticated, function(req, res) {
    Choices.find({"user":req.user.user}, function(err, choices){
      if(!err){
        console.log(choices);
        res.json(choices);
      } else {
        console.log(err);
      }
    });
  });

  router.get('/choices', isAuthenticated,  function(req, res){
    res.render('choices');
  });

  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
  }));

  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  router.post('/vote', function(req, res) {
    console.log(req.user);
    Choices.update({
        "user": req.user.user
      }, {
        $set: {
          "selections": req.body.selections
        }
      }, {
        upsert: true
      },
      function(err, Choices) {
        console.log(Choices);
        res.send((err === null) ? {
          msg: Choices
        } : {
          msg: err
        })
      });

  });
  
  return router;

}
