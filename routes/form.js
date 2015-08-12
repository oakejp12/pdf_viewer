/*jslint node: true*/
'use strict';

var express = require('express'),
  router = express.Router(),
  MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

// TODO : Production - need to change this url
var url = 'mongodb://localhost:27017/pdf_viewer';


/* POST form */
router.post('/', function (req, res) {

  console.log('*** Form Data below! ***');
  console.dir(req.body);

  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);

    var collection = db.collection('pdf_models');
    var doc = req.body;

    // collection.update(selector, document, {upsert: true})
    // { Name: "Johan Oakes", Result : { }}
    collection.update({
      "Name": doc.Name,
      "Version": "7-10-1620"
    }, {
      $addToSet: {
        "Result": {
          "PDF": doc.PDF,
          "Score": doc.Score,
          "Print_S": doc.S_Print
        }
      }
    }, {
      upsert: true
    });
  });

  res.send('View the next pdf selection.');
});


module.exports = router;