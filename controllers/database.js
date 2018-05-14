var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId; 
var url = "mongodb://localhost:27017/";


function addSource(source, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TrabalhoPratico");
        var myobj = { src: source };
        var hasOne = 0;
        dbo.collection("sources").find({}, { _id: 0, src: 1 }).toArray(function(err, result) {
            if (err) throw err;
            for(let i=0;i<result.length;i++) {
                if(result[i].src == source) {
                    hasOne++;
                }
            }
            if(!hasOne) {
                dbo.collection("sources").insertOne(myobj, function(err, res) {
                    if (err){ callback(err, ''); throw err; }
                    callback(null, myobj);
                });
            } else {
                callback(1, 'Já existe registo');
            }
            db.close();
        });       
    });
}

function getSources(callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TrabalhoPratico");
        dbo.collection("sources").find({}, { _id: 1, src: 1 }).toArray(function(err, result) {
            if (err) throw err;
            callback(null, result);            
            db.close();
        });       
    });
}

function getSource(id, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {callback(1, err); throw err;}
        var dbo = db.db("TrabalhoPratico");
        var o_id = new ObjectId(id);
        dbo.collection("sources").find({ "_id": o_id }, {}).toArray(function(err, result) {
            if (err) throw err;
            callback(null, result);            
            db.close();
        });       
    });
}

function deleteSource(id, callback) {
    MongoClient.connect(url, function(err, db) {      
        if (err){ callback(1, err); throw err;}
        var dbo = db.db("TrabalhoPratico");
        var o_id = new ObjectId(id);
        var myquery = { _id: o_id };
        dbo.collection("sources").deleteOne(myquery, function(err, obj) {
            if (err) throw err;
            callback(0, '');
            db.close();
        });
    });
}

function editSource(id, src, callback) {
    MongoClient.connect(url, function(err, db) {      
        if (err){ callback(1, err); throw err;}
        var dbo = db.db("TrabalhoPratico");
        var o_id = new ObjectId(id);
        var myquery = { _id: o_id };
        var newvalues = { $set: { src:src } };
        dbo.collection('sources').updateOne(myquery, newvalues, function(err, result) {
           callback(0, '');  
        });
    });
}

function addData(things) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TrabalhoPratico");

        for(let i=0;i<things.length;i++) {
            let data = things[i];
            dbo.collection("data").find({}, { _id: 0, title: 1, author: 1 }).toArray(function(err, result) {
                if (err) throw err;  
                let hasOne = 0;
                for(let x=0;x<result.length;x++) {
                    if(result[x].title == data.title && result[x].author == data.author) {                      
                        hasOne = 1;
                        db.close();
                    }
                }
                if(!hasOne) {
                    dbo.collection("data").insertOne(data, function(err, res) {
                        if (err){ throw err; }      
                        
                    });
                }      
            });
        }
    });
}

function searchData(keyword, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TrabalhoPratico");
        var myobj = { src: source };
        var hasOne = 0;
        dbo.collection("data").find({}, { _id: 0, title: 1, author: 1, description: 1, subject: 1}).toArray(function(err, result) {
            console.log(result);
            db.close();
        });       
    });
}


exports.addSource = addSource;
exports.getSources = getSources;
exports.getSource = getSource;
exports.deleteSource = deleteSource;
exports.editSource = editSource;
exports.addData = addData;