/**
 * Created by root on 7/28/15.
 */

var express = require('express'),
    router = express.Router(),
    util = require('util'),
    fs = require('fs');

var mongo = require('mongodb'),
    db = new mongo.Db('pdfs', new mongo.Server('127.0.0.1', 27017)),
    ObjectID = mongo.ObjectID,
    Grid = require('gridfs-stream'),
    gfs;


db.open(function(err, db) {
    if (err) throw err;
    gfs = Grid(db, mongo);
});

