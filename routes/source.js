var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var database = require('../controllers/database');
var oaiPmh = require('../controllers/oai-pmh-harvester-master');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended:false});

/* GET home page. */
router.post('/new', urlencodedParser, function(req, res, next) {
    if(!req.body) return res.sendStatus(400);
    database.addSource(req.body.src, function(err, resp){
        if(err) {
           res.render('errorMessage', {message: resp});
        } else {
            res.render('index', {title:'Express'});
        }
    });
  //res.render('index', { title: 'Express' });
});

router.get('/list', urlencodedParser, function(req, res, next) {
    if(!req.body) return res.sendStatus(400);
    database.getSources(function(err, resp) {
        if(err){
            res.render('errorMessage', { message:resp });
        } else {
            res.render('listSource', { sources:resp });
        }
    });
  
});

router.delete('/delete/:id', urlencodedParser, function(req, res, next) {
    var id = req.params.id;
    database.deleteSource(id, function(err, resp) {
        if(err){
            res.render('errorMessage', { message:resp });
        } else {
            database.getSources(function(err, resp) {
                if(err){
                    res.render('errorMessage', { message:resp });
                } else {
                    res.render('deleteResponse', { sources:resp });
                }
            });
        }
    });
    /*database.getSources(function(err, resp) {
        if(err){
            res.render('errorMessage', { message:resp });
        } else {
            res.render('listSource', { sources:resp });
        }
    });*/
  
});

router.get('/edit/:id', urlencodedParser, function(req, res, next) {
    var id = req.params.id;
    database.getSource(id, function(err, resp) {
        if(err){
            res.render('errorMessage', { message:resp });
        } else {
            res.render('editSource', { id:resp[0]._id, src:resp[0].src });
        }
    });
});

router.put('/edit/:id/:src', urlencodedParser, function(req, res, next) {
    var id = req.params.id;
    var src = req.params.src;
    database.editSource(id, src, function(err, resp) {
        if(err){
            res.render('errorMessage', { message:resp });
        } else {
            res.send('ok');
        }
    });
});

router.post('/extract', urlencodedParser, function(req, res, next) {
    var source = req.body.SOURCE;
    oaiPmh.extractData(source, function(s) {
        res.render('index', { title:'Express' });
    });
});

module.exports = router;
