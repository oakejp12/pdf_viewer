var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


module.exports = function (config) {
  MongoClient.connect(config.db, function (err, db) {
    assert.equal(null, err);
    console.log('MongoDB connected.');
    db.close();
  });
};