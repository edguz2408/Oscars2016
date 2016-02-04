var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getData', function(req, res) {
  var db = req.db;
  var collection = db.get('Nominations');
  collection.find({},{},function(e,docs){
        console.log(docs);
        res.json(docs);
    });

});

router.post('/vote', function(req, res){
  var db = req.db;
  var collection = db.get('Choices');
  console.log(req.body.user);

  var body = req.body;
  console.log(body);
  var user = req.body.user;
  //console.log(req.body);

  collection.update({"user":user}, {"selections": req.body.selections}, {upsert: true},
  function(err, result){
    res.send((err === null) ? { msg: result } : { msg: err })
  });
  
});

module.exports = router;
