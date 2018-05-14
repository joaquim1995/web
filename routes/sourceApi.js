var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var database = require('../controllers/database');
var oaiPmh = require('../controllers/oai-pmh-harvester-master');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended:false});

/*List*/
router.get('/sources', urlencodedParser, function(req, res, next) {
    if(!req.body) return res.sendStatus(400);
    database.getSources(function(err, resp) {
        if(err){
            res.sendStatus(400).jsonp({ 'Erro':resp });
        } else {
            res.jsonp({'Sources': resp});
        }
    });
  
});

/* New */
router.post('/sources', jsonParser, function(req, res, next) {
    if(!req.body) return res.sendStatus(400);
    database.addSource(req.body.src, function(err, resp){
        if(err) {
           res.jsonp({'Erro': resp});
        } else {
           res.jsonp({'Saved': resp});
        }
    });
  //res.render('index', { title: 'Express' });
});

/*Delete*/
router.delete('/sources/:id', function(req, res, next) {
    var id = req.params.id;
    console.log(req);
    database.deleteSource(id, function(err, resp) {
        if(err){
            res.jsonp({ 'Erro':resp });
        } else {
            res.jsonp({ 'Delete':resp});
        }
    });  
});

/*Edit*/
router.put('/sources/:id', jsonParser, function(req, res, next) {
    var id = req.params.id;
    var src = req.body.src;
    database.editSource(id, src, function(err, resp) {
        if(err){
            res.jsonp({ 'Erro':resp });
        } else {
            res.jsonp( {'Edit':resp});
        }
    });
});

/*Extract*/
router.get('/sources/:id/extract', urlencodedParser, function(req, res, next) {
    var id = req.params.id;
    oaiPmh.extractData(id, function(err, resp) {
        if(err){
            res.jsonp({ 'Erro':resp });
        } else {
            res.jsonp( {'Extract':resp.result});
        }
    });
});

module.exports = router;
