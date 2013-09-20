var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('timeDb', server, {safe: false});


db.open(function(err, db){
    if(!err){
	console.log("Connected to DB");
	db.collection('lists', {strict: true}, function(err, collection){
	    if(err){
		console.log("The lists collection does not exist");
		createDB();
	    }
	});
    }
});


exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving list: ' + id);
    db.collection('lists', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    console.log('Retrieving all lists');
    db.collection('lists', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    var list = req.body;
    console.log('Adding list: ' + JSON.stringify(list));
    db.collection('list', function(err, collection) {
        collection.insert(list, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.update = function(req, res) {
    var id = req.params.id;
    var list = req.body;
    console.log('Updating list: ' + id);
    console.log(JSON.stringify(list));
    db.collection('lists', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, list, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating list: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(list);
            }
        });
    });
}

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting list: ' + id);
    db.collection('lists', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}




// Create the DB
createDB = function(){
    var lists = [
	{
	    'name': 'Habits',
	    'archived': false,
	},
	{
	    'name': 'Chores',
	    'archived': false
	}

    ];

    db.collection('lists', function(err, collection){
	collection.insert(lists, {safe: true}, function(err, result){});
    });

    console.log('Created DB');

};
