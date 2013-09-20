var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('timeDb', server, {safe: false});

db.open(function(err, db){
    if(!err){
	console.log('Connected to DB');
    }
});


exports.findAll = function(req, res){
    console.log('Retrieving all tasks');
    db.collection('tasks', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};


exports.findByList = function(req, res){
    var list_id = req.params.list_id;
    console.log('Retrieving tasks for list - ' + list_id);
    db.collection('tasks', function(err, collection) {
        collection.find({'_list_id': list_id}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    console.log(req);
    var task = req.body;
    console.log('Adding task: ' + JSON.stringify(task));
    task._list_id = req.params.list_id;

    console.log('Adding task: ' + JSON.stringify(task));
    db.collection('tasks', function(err, collection) {
        collection.insert(task, {safe:true}, function(err, result) {
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
    var task = req.body;
    console.log('Updating task: ' + id);
    console.log(JSON.stringify(task));
    db.collection('tasks', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, task, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating task: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(task);
            }
        });
    });
}

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting task: ' + id);
    db.collection('tasks', function(err, collection) {
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
