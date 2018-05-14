var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var database = require('../controllers/database');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended:false});


router.get('/get/:word', urlencodedParser, function(req, res, next) {
    if(!req.body) return res.sendStatus(400);
    var word = req.params.word;
    database.searchData(word, function(err, resp) {
        if(err){
            res.render('errorMessage', { message:resp });
        } else {
            res.render('dataFound', { data:resp });
        }
    });
  
});


module.exports = router;
