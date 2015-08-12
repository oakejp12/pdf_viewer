/*jslint node: true */
'use strict';


/**
 * TODO: Refactor the GET method from readFiles.js
 *
 */


var express = require('express'),
  router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {

  var express = require('express'),
    util = require('util'),
    fs = require('fs');

  /**
   * Get filenames for fs.files
   * TODO : Get filenames based on version
   * TODO : Abstract MongoClient.connect function
   * @returns []
   */
  function getFiles(callback) {
    console.log('*** Reading filenames ***');

    readDocuments(function (data) {
      callback(data);
    });
  }

  /**
   * Read documents from MongoDB
   * Procedural :: readDocuments -> nameSeparation -> randomizedArray
   * @param db ::
   */
  var readDocuments = function (callback) {
    var nameSeparated = [],
      U_names = [],
      S_names = [],
      randomizedArray = [];
    var wantedPdfs = 20; // TODO : manipulate via wanted pdf test cluster

    // TODO : Change based on version
    // ./server/uploads/{version}/
    var fileNames = fs.readdirSync('./server/uploads/7-10-1620/');


    nameSeparated = nameSeparation(fileNames);
    U_names = nameSeparated[0].slice(0);
    S_names = nameSeparated[1].slice(0);

    randomizedArray = randomizeArray(U_names, S_names, wantedPdfs);

    U_names = randomizedArray[0].slice(0);
    S_names = randomizedArray[1].slice(0);

    callback([U_names, S_names]);
  };



  /**
   *
   * Isolate filenames from docs returned by MongoDB into two arrays :
   *  One array is filled with all simplified pdfs, the other is unsimplified pdfs
   * @param array stores 'filename' from JSON array
   * @returns {*[]} a multidimensional array holding U and S files
   */
  function nameSeparation(array) {
    if (array.length > 0) {
      var S_names = [],
        U_names = [];

      for (var i = 0, j = array.length; i < j; i++) {
        var key = array[i];
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
    } else {
      console.log("Array of filenames is empty!");
    }
  }

  /**
   * Utility function to separate S_ and U_ pdfs
   * @param needle: what we want to find in the string
   * @returns {boolean}: whether needle is in string or not
   */
  String.prototype.startsWith = function (needle) {
    return (this.indexOf(needle) === 0);
  };

  /**
   * Sort arrays s.t. both arrays have same pdf relative name
   * @param u_array
   * @param s_array
   * @param wnumber
   * @returns {*[]} a multidimensional array holding random U and S files
   */
  function randomizeArray(u_array, s_array, wnumber) {
    console.log('*** Number of PDFs wanted: %d ***', wnumber);
    // Holds a random range between 0:10
    var range = [],
      newU = [],
      newS = [];

    // Math.floor(Math.random() * (max - min + 1)) + 1
    var randomNumber = Math.floor(Math.random() * (34 - 1 + 1)) + 1;

    // Generate random array
    // TODO : The modular number changes based on how many pdfs are available
    for (var i = 0; i < wnumber; i++) {
      // Do it mod 35 since we don't want (34 mod 34) === 0 => pfd at index 34 will never be shown
      range.push((randomNumber + i) % 35);
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
   * TODO : I have the random file names, now I need to render them to index.jade
   *  array in getFiles already has the filenames we want
   *  We just need to fetch the actual PDF data from MongoDB to render them
   */
  getFiles(function (array) {
    res.render('index', {
      data: JSON.stringify(array)
    });
  });

});



module.exports = router;