var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getData', function(req, res) {
  var db = req.db;
  var collection = db.get('Nominees');
  collection.find({},{},function(e,docs){
        console.log(docs);
        res.json(docs);
    });

});

module.exports = router;
