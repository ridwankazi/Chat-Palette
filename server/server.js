/**
 *   This is the server file that will serve up all of
 *   our front end pages based on which endpoints are
 *   being fired and will also handle any database manipulation
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var bookshelf = require('bookshelf');  //delete?

var db = require('./db.js');
var Users = require('./controllers/userController.js');
var Messages = require('./controllers/messageController.js');

var rootpath = path.normalize(__dirname + '/..');

//Creates instance of express object
var app = express();
app.use(bodyParser.json());

app.set('bookshelf', db);	//delete?

app.get('/', function(req, res) {
  res.redirect('/chat'); 
});

//this will be used for login page
app.post('/login', function(req, res) {
	Users.getUser(req.body.username, function(user) {
		user ? res.status(201).json(user) : res.sendStatus(404);
	});
});

app.get('/login', function(req, res) {
	Users.getUsers(function(collection) {
		console.log(collection);
		res.status(200).json(collection);
	})
})

//this will be used to signin
app.post('/signup', function(req, res) {
  Users.createUser(req.body.username, req.body.password, function(user) {
  	res.status(201).json(user);
  });
});

//this will serve up the main chat page
app.get('/chat', function(req, res) {
	Messages.getAllMessages(function(collection) {
		res.status(200).json(collection.models);
	});
});

//this posts a message to the main chat page
app.post('/chat', function(req, res) {
	Messages.createMessage(req.body.content, req.body.username, function(collection) {
		res.status(201).json(collection);
	});
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
	console.log("Listening on " + port);
});
