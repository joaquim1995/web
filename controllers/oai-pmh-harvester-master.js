var fs = require('fs');
const oaipmh = require('../my_modules/oai-pmh-harvester/oai-pmh-harvester.js');
var database = require('./database');
let things = [];

var count = 0;
function extractData( id, callback){    
    database.getSource(id, function(err, resp){
        dataProviderUrl = resp[0].src;
        let harvester = new oaipmh.Harvester(dataProviderUrl);

        // harvest data source passing a processing function
        harvester.harvest(processItem, function(err, res){      
            database.addData(things, function(err, result) {
                if(err){
                    callback(1, 'Erro ao gravar dados' );
                } else {
                    callback(null, result);
                }                
            });
        });
    });
}

// This function will process each harvested record
function processItem(item) {
    try {
        /*fs.writeFile("/tmp/test"+count, JSON.stringify(item), function(err) {
            if(err) {
                return console.log(err);
            }        
        }); */
        let titles = item.metadata['oai_dc:dc']['dc:title'];
        let title = (typeof titles == 'object' )?titles.join("\n"):titles;

        let authors = item.metadata['oai_dc:dc']['dc:creator'];
        let author = (typeof authors == 'object' )?authors.join("\n"):authors;

        let descriptions = item.metadata['oai_dc:dc']['dc:description'];
        let description = (typeof descriptions == 'object' )?descriptions.join("\n"):descriptions;

        let dates = item.metadata['oai_dc:dc']['dc:date'];
        let date = (typeof dates == 'object' )?dates.join("\n"):dates;

        let languages = item.metadata['oai_dc:dc']['dc:language'];
        let language = (typeof languages == 'object' )?languages.join("\n"):languages;
        
        let subjects = item.metadata['oai_dc:dc']['dc:subject'];
        let subject = (typeof subjects == 'object' )?subjects.join("\n"):subjects;

        let data = {
            title : title,
            author : author,
            description : description,
            date : date,
            language : language,
            subject : subject
        }

        things.push(data);
        //console.dir(item.metadata['oai_dc:dc']);
        count++;
    } catch(err) {
        // handle errors here
    }
};

exports.extractData = extractData;