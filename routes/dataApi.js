var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var database = require('../controllers/database');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended:false});


router.get('/datas/:word', urlencodedParser, function(req, res, next) {
    if(!req.body) return res.sendStatus(400);
    var word = req.params.word;
    database.searchData(word, function(err, resp) {
        if(err){
            res.jsonp({'Erro': resp});
        } else {
            res.jsonp({'Data': resp });
        }
    });
  
});


router.get('/extractions', function(req, res, next) {
    console.log('Teste out');
    database.getSearchs(function(err, resp) {
        if(err){
            res.jsonp({'Erro': resp});
        } else {
            res.jsonp({'Data': resp });
        }
    });
  
});


module.exports = router;
