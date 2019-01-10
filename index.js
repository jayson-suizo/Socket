var express = require("express");
var socket = require("socket.io");


//App Setup
var app = express();

var server = app.listen(process.env.PORT || 4000, function(){
	console.log('listen to request on ports 4000');
});


//Static files 

app.use(express.static("public"));


//Socket setup
var io = socket(server);


io.on("connection", function(socket){
	console.log("made socket connection", socket.id);

	socket.on("chat", function(data){
		io.sockets.emit("chat",data);
	});

	socket.on("typing", function(data){
		socket.broadcast.emit("typing",data);
	});
});


//https://www.youtube.com/watch?v=UwS3wJoi7fY&index=3&list=PL4cUxeGkcC9i4V-_ZVwLmOusj8YAUhj_9

