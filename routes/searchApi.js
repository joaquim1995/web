var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var database = require('../controllers/database');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended:false});

router.get('/searchs', urlencodedParser, function(req, res, next) {
    database.getSearchs(word, function(err, resp) {
        if(err){
            res.jsonp({'Erro': resp});
        } else {
            res.jsonp({'Data': resp });
        }
    });
  
});


module.exports = router;
