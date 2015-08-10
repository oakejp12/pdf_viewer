var mongoose = require('mongoose');


module.exports = function (config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error...'));
    db.once('open', function callback(){
        console.log('Mongoose connected.');
    });

    /* Created within pdf_viewer/users' */
    var userSchema = mongoose.Schema({
        firstName: String,
        lastName: String,
        userName: String
    });

    var User = mongoose.model('User', userSchema);

    User.find({}).exec(function(err, collection){
        if(collection.length === 0) {
            User.create({firstName: 'Johan', lastName: 'Oakes', userName: 'oakes'});
            User.create({firstName: 'Joe', lastName: 'Paul', userName: 'jpaul'});
            User.create({firstName: 'John', lastName: 'Baptist', userName: 'jbaptist'});
        }
    })
};
