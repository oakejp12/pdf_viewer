'use strict';

var express = require('express'),
    router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// TODO : Production - need to change this url
var url = 'mongodb://localhost:27017/pdf_viewer';


/* POST form */
router.post('/', function(req,res) {
    console.log(req.body);

    MongoClient.connect(url, function (err, db) {
        assert.equal(null,err);

        console.log(req.body);

        var collection = db.collection('pdf_models');
        var doc = req.body;

        collection.insertOne(doc, function(err, result) {
            assert.equal(err,null);
            console.log("Inserted a document: " + JSON.stringify(doc));
            db.close();
        });
    });

    res.send('View the next pdf selection.');
});


module.exports = router;