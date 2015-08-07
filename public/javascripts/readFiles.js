/**
 * Created by root on 7/28/15.
 */


'use strict';


var express = require('express'),
    router = express.Router,
    util = require('util'),
    assert = require('assert'),
    fs = require('fs');

var mongo = require('mongodb'),
    db = new mongo.Db('pdfs', new mongo.Server('127.0.0.1', 27017)),
    MongoClient = mongo.MongoClient,
    Grid = require('gridfs-stream'),
    gfs;


db.open(function(err, db) {
    if (err) throw err;
    gfs = Grid(db, mongo);
});

var url = 'mongodb://localhost:27017/pdfs';

function connectToMongo(callback) {
    MongoClient.connect(url, callback);
}

/**
 * Get filenames for fs.files
 * TODO : Get filenames based on version
 * TODO : Abstract MongoClient.connect function
 * @returns []
 */
function getFiles(callback) {

    // TODO : Change URL for production system
    connectToMongo(function (err, db) {
        assert.equal(null, err);

        console.log('*** Reading filenames : MongoClient.connect() ***');
 
        readDocuments (db, function(data) {
          console.log("*** Reading file info : readDocuments()");

          callback(data);

          db.close();
        });
    });
}
 
/**
* Read documents from MongoDB
* Procedural :: readDocuments -> nameSeparation -> randomizedArray 
* @param db :: 
*/
var readDocuments = function(db, callback) {
  var nameSeparated = [], U_names = [], S_names = [], randomizedArray = [];
  var wantedPdfs = 8; // TODO : manipulate via wanted pdf test cluster

  // Collection to read from
  var collection = db.collection('fs.files');

  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
                
    if (docs === null) {
      console.log("*** Closing database : couldn't read filenames ***");
      db.close();
    }

    console.log('Found %d documents when reading from database', docs.length);
                
    nameSeparated   = nameSeparation(docs);
    U_names         = nameSeparated[0].slice(0);
    S_names         = nameSeparated[1].slice(0);
     
    randomizedArray = randomizeArray(U_names, S_names, wantedPdfs);
                
    U_names         = randomizedArray[0].slice(0);
    S_names         = randomizedArray[1].slice(0);

    callback([U_names, S_names]);
  });
};



/**
 *
 * Isolate filenames from docs returned by MongoDB into two arrays :
 *  One array is filled with all simplified pdfs, the other is unsimplified pdfs
 * @param array stores 'filename' from JSON array
 * @returns {*[]} a multidimensional array holding U and S files
 */
function nameSeparation(array) {
    console.log('*** Separating names : nameSeperation() ***');
 
 
    if (array.length > 0) {
        var S_names = [], U_names = [];
 
        for (var i = 0, j = array.length; i < j; i++) {
            var key = array[i]['filename'];
            if (key.startsWith("S_"))
                S_names.push(key);
            else if (key.startsWith("U_"))
                U_names.push(key);
            else console.log("Couldn't find an array for: " + key);
        }
 
        // Sort both arrays alphabetically
        S_names.sort();
        U_names.sort();
 
        // Check whether they match
        /*
         for (i = 0, j = U_names.length; i < j; i++) {
         if (U_names.length != S_names.length) throw "Arrays aren't the same size!";
         if (U_names[i].substr(2, U_names[i].length) === S_names[i].substr(2, S_names[i].length))
         console.log(U_names[i] + '  *****  ' + S_names[i]);
         }
         */
 
        return [U_names, S_names];
    }
    else {
        console.log("Array of filenames is empty!");
    }
}
 
/**
 * Utility function to separate S_ and U_ pdfs
 * @param needle: what we want to find in the string
 * @returns {boolean}: whether needle is in string or not
 */
String.prototype.startsWith = function(needle) {
    return(this.indexOf(needle) === 0);
};
 
/**
 * Sort arrays s.t. both arrays have same pdf relative name
 * @param u_array
 * @param s_array
 * @param wnumber
 * @returns {*[]} a multidimensional array holding random U and S files
 */
function randomizeArray(u_array, s_array, wnumber) {
    console.log('*** Randomizing filenames : randomizeArray() ***');
 
    // Holds a random range between 0:34
    var range = [], newU = [], newS = [];
 
    var randomNumber = Math.floor(Math.random() * (34 + 1));
 
    // Generate random array
    // TODO : The modular number changes based on how many pdfs are available
    for (var i = 0; i < wnumber; i++) {
        // Do it mod 35 since we don't want (34 mod 34) === 0 => pfd at index 34 will never be shown
        range.push((randomNumber + i) % 12);
    }
 
    var j;
    for (i = 0, j = range.length; i < j; i++) {
        var index = range[i];
        newU.push(u_array[index]); // Holds the unsimplified pdfs to test
        newS.push(s_array[index]); // Holds the simplified pds to test
    }
 
    return [newU, newS];
}

/**
* @param data : multidimensional array of [U_names, S_names]
* TODO : I have the random file names, now I need to render them to index.jade
*/
function callForDocs(){
    getFiles(function(data){
        console.log('*** Calling getFiles ***');

        var U_names = data[0];
        var S_names = data[1];

        function renderUnsimplied(unsimple, simple) {
            connectToMongo(function (err, db){
                assert.equal(null, err);
                // console.dir(unsimple);

                db.close();
            });
        }


    renderUnsimplied(U_names, S_names);
    });
}


router.post('/', function )
callForDocs();