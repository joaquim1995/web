var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId; 
var url = "mongodb://localhost:27017/TrabalhoPratico";
var mongoose = require('mongoose');
var fs = require('fs');
var Schema = mongoose.Schema;

var SourceSchema = new Schema({
    src: String
});
var Source = mongoose.model('source', SourceSchema);

var DataSchema = new Schema({
    title: String,
    author: String,
    description: String,
    date: Date,
    language: String,
    subject: String
});
var Data = mongoose.model('data', DataSchema);

var SearchSchema = new Schema({
    count: Number,
    dateStart: Date,
    dateEnd: Date
});
var Search = mongoose.model('search', SearchSchema);

function addSource(source, callback) {
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error',function(err){
        console.error(err);
    });    

    db.once('open',function(){
        var query = Source.find({});
        query.where('src', source);
        query.exec(function (err, docs) {
            if(docs.length) {
                callback(1, 'Já existe este registo');                    
            } else {
                var s1 = new Source({
                    src: source
                });
                
                s1.save(function(err, result){
                    callback(null, result);                        
                });
            }  
        });          
    });    
}

function getSources(callback) {
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error',function(err){
        callback(1, err);
    });    

    db.once('open',function(){
        var query = Source.find({});
        query.exec(function (err, docs) {
            callback(null, docs);  
        });          
    });         
}

function getSource(id, callback) {
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error',function(err){
        callback(1, err);
    });    

    db.once('open',function(){
        var o_id = new ObjectId(id);
        var query = Source.find({});
        query.where('_id', o_id);
        query.exec(function (err, docs) {
            callback(null, docs);  
        });          
    });  
}

function deleteSource(id, callback) {
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error',function(err){
        callback(1, err);
    });    

    db.once('open',function(){
        var o_id = new ObjectId(id);
        Source.remove({'_id': o_id}, function(err, resp){
            callback(null, resp); 
        });        
    });  
}

function editSource(id, src, callback) {   
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error',function(err){
        callback(1, err);
    });    

    db.once('open',function(){
        var o_id = new ObjectId(id);    

        Source.update({ '_id': o_id }, { src:src }, function(err, resp){
            if(err) {
                callback(1, err);
            } else {
                callback(null, resp);
            }
        });
    });
}

function addData(things, callback) {
    mongoose.connect(url);
    let arrData = [], dateStart = new Date(), dateEnd, tot;
    var db = mongoose.connection;
    db.on('error',function(err){
        console.error(err);
    });    
    for(let i=0;i<things.length;i++) {
        let data = things[i];
        arrData.push(new Data({
            title: data.title,
            author: data.author,
            description: data.description,
            date: data.date,
            language: data.language,
            subject: data.subject
        }));

    } 
    db.once('open',function(){        
        Data.collection.insert(arrData, function (err, docs) {
            if (err){ 
                return console.error(err);
            } else {
                let data = {
                    count: docs.result.n,
                    dateStart: dateStart,
                    dateEnd: new Date()
                }
                addSearchInfo(data);
                callback(null, docs);
            }
        });       
    });
}

function searchData(keyword, callback) {
    let arrayData = [];

    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error',function(err){
        callback(1, err);
    });    

    db.once('open',function(){
        let query = Data.find({});
        query.exec(function (err, docs) {
            for(let i=0;i<docs.length;i++) {
                let title = author = description = subject = date = true;
                if(docs[i].title) { title = ((docs[i].title).indexOf(keyword) !== -1); } else { title = false; }
                if(docs[i].author) { author = ((docs[i].author).indexOf(keyword) !== -1); } else { author = false; }
                if(docs[i].description) { description = ((docs[i].description).indexOf(keyword) !== -1); } else { description = false; }
                if(docs[i].subject) { subject = ((docs[i].subject).indexOf(keyword) !== -1); } else { subject = false; }
                if(docs[i].date) { date = (new Date(docs[i].date).getTime() === new Date(keyword).getTime()); } else { date = false; }
                if(  title || author || description || subject || date  ) { arrayData.push(docs[i]); }
            }
            db.close();
            callback(null, arrayData); 
        });          
    });  
}

function addSearchInfo(data) {
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error',function(err){
        console.error(err);
    });    
    db.once('open',function(){
        var s1 = new Search({
            count: data.count,
            dateStart: data.dateStart,
            dateEnd: data.dateEnd
        });

        s1.save(function(err, result){ });
    });
}

function getSearchs(callback) {
    console.log('Teste 1');
    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error',function(err){
        callback(1, err);
    });    
    console.log('Teste 2');
    db.once('open',function(){
        console.log('Teste 3');
        var query = Search.find({});
        query.exec(function (err, docs) {
            console.log('Teste 4');
            console.log(docs);
            callback(null, docs);  
        });          
    });         
}
exports.addSource = addSource;
exports.getSources = getSources;
exports.getSource = getSource;
exports.deleteSource = deleteSource;
exports.editSource = editSource;
exports.addData = addData;
exports.searchData = searchData;
exports.getSearchs = getSearchs;