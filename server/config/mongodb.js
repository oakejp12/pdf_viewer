var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


// TODO : Production - need to change this
var url = 'mongodb://localhost:27017/pdf_viewer';


module.exports = function(config) {
    MongoClient.connect(config.db, function (err, db) {
        assert.equal(null, err);
        console.log('MongoDB connected.');
        db.close();
    });
};