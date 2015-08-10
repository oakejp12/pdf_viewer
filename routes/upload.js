/*jslint node: true*/
'use strict';

var express = require('express'),
    router = express.Router(),
    util = require('util'),
    fs = require('fs');

var mongo = require('mongodb'),
    Db = mongo.Db,
    Server = mongo.Server,
    db = new Db('pdfs', new Server('127.0.0.1', 27017)),
    ObjectID = mongo.ObjectID,
    Grid = require('gridfs-stream'),
    gfs;

db.open(function(err, db) {
    if (err) throw err;
    gfs = Grid(db, mongo);
});

/* Get upload view */
router.get('/', function(req, res) {
  res.render('upload');
});


/* POST the PDF documents */
// TODO: Hook up to MongoDB - Gridfs
router.post('/', function (req,res) {

    /*
    if (req.files) {
        console.log("Inspecting... \n" + util.inspect(req.files));
        console.log(req.body); // Spits out { version: 'input'}
    }
    */

    var files = req.files.file;
    var file = 'file';

    console.log("******** Is files an array: " + Array.isArray(files));

    var filename = files.name;
    var path = files.path;
    var type = files.mimetype;
    var fileId = new ObjectID();

    var writeStream = gfs.createWriteStream({
        _id: fileId.str,
        filename: filename,
        mode: 'w',
        content_type: type,
        metadata: req.body
    });

    // TODO : Find difference between uploading one file and two+ files
    if (!Array.isArray(files)) {
        console.log('*** Only uploading one file ***');


        console.log('Creating WriteStream for ' + filename);


        if (files.hasOwnProperty(file)) {
            fs.createReadStream(path).pipe(writeStream);
        }

        writeStream.on('close', function () {
            console.log('Success on ' + path);
            /*
             fs.unlink(path, function (err) {
                if (err) throw err;
                else console.log('Deletion on ' + path)
             });
             */
        });

    }

    else {
        console.log('*** Uploading multiple files ***');

        for (file in files) {

            filename = files[file].name;
            path = files[file].path;
            type = files[file].mimetype;
            fileId = new ObjectID();

            console.log('Creating WriteStream for ' + filename);
            writeStream = gfs.createWriteStream({
                _id: fileId.str,
                filename: filename,
                mode: 'w',
                content_type: type,
                metadata: req.body
            });

            if (files.hasOwnProperty(file)) {
                fs.createReadStream(path).pipe(writeStream);
            }

            writeStream.on('close', function () {
                console.log('Successful uploading!');
                /*
                 fs.unlink(path, function (err) {
                    if (err) throw err;
                    else console.log("Deletion on " + path)
                 });
                 */
            });
        }
    }
    res.redirect('upload');
});


module.exports = router;
