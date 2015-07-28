/**
 * Utility to pool files from a remote url
 */

var express = require('express');
var app = express();
var fs = require('fs');


/**
 * Asynchronous read of the contents of a directory
 * Deletes all files in the directory provided
 * @param rootPath : directory holds all pdf files to be deleted
 * TODO : Make onClick method so that function runs when going to different routes
 */
var rootPath = './server/uploads/';
var files = fs.readdir(rootPath, function (err, files){
    if (err) throw err;
    for (var i = 0; i < files.length; i++) {
        var filePath = rootPath + files[i];
        if (fs.statSync(filePath). isFile()) {
            fs.unlinkSync(filePath);
        }
    }
});
