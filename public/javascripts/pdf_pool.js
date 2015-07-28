/**
 * Utility to pool files from a remote url
 */

var express = require('express');
var app = express();
var fs = require('fs');

// TODO : Retrieve Mongo PDF's here?




/**
 * Returns an array of filenames excluding '.' and '..'
 * Asynchronous read of the contents of a directory
 */
var files = fs.readdir('../../public/pdfs', function (err, files){
    if (err) throw err;
    for (var i in files) {
        console.log(files[i]);
    }
});
