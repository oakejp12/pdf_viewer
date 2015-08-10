'use strict';

var express = require('express'),
    router = express.Router(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// TODO : Production - need to change this url
var url = 'mongodb://localhost:27017/pdf_viewer';


/* POST form */
router.post('/', function(req,res) {

    console.log('*** Form Data below! ***');
    console.dir(req.body);

    MongoClient.connect(url, function (err, db) {
        assert.equal(null,err);

        var collection = db.collection('pdf_models');
        var doc = req.body;

        // collection.update(selector, document, {upsert: true})
        collection.update({"Name": doc.Name}, {"Name": doc.Name, "better_pdf": doc.better_pdf}, {upsert: true});


        /*
        // If "Name" already exists (person has already submitted a document) then update
        if ((collection.find({"Name" : doc.Name.toString()}).count()) > 0) {
            console.log('Document exists already so updating that one!');
        } else { // Insert a new document
            collection.insertOne(doc, function (err, result) {
                assert.equal(err, null);
                console.log('Inserted a document: ' + JSON.stringify(doc));
                db.close();
            });
        }
        */
    });

    res.send('View the next pdf selection.');
});


module.exports = router;