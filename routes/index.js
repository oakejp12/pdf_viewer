var express = require('express'),
    router = express.Router();

var readFiles = require('../public/javascripts/readFiles');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index');
});


router.post('/', function(req, res, next) {
  console.log('I am in the post shit!');
});



module.exports = router;
