const express = require("express");
const socket = require("socket.io");
const mysql = require("mysql");
const moment = require("moment");


//App Setup
const app = express();

app.use(express.json());

const connection = mysql.createConnection({
	//properties
	host: "192.168.9.14",
	user: "root",
	password: "admin",
	database: "pu_local_server"

});

connection.connect(function(error) {
	if(!!error) {
		console.log("problem in db connection");
	}else {
		console.log("Connected!!");
	}
  
});


const server = app.listen(process.env.PORT || 4000, function(){
	console.log('listen to request on ports 4000');
});

//Socket setup
const io = socket(server);

io.on("connection", function(socket){
	var uid = null;
	socket.on("editor_reply", function(data){
		hid = data.peach_hid;
		connection.query("SELECT o.uid from `orders` as o,`home` as h where o.oid = h.oid AND h.hid ="+hid+" LIMIT 1", function(error, rows, fields){
			if(!!error) {
				io.sockets.emit("editor_reply",{"success" : false,"data" : error});
			} else {
				if(rows.length > 0) {
					io.sockets.emit("editor_reply",{"success" : true,"data" : rows,"added_data" : data});
				}else {
					io.sockets.emit("editor_reply",{"success" : false,"data" : "no data available!"});
				}
			}
		});
		
	});
	socket.on("user_reply", function(data){
		io.sockets.emit("reply",data);
		
	});

	socket.on("peachUser", function(data) {
    	
    });

    socket.on("view_all_user", function(data) {
    	var now = moment().format("YYYY-MM-DD:hh:mm:ss");
    	query_string = "UPDATE `photo-note-reply` as p SET p.date_viewed = '"+now+"' WHERE p.date_viewed IS NULL AND p.sid IS NOT NULL AND p.hid IN("+data.homes+")";
    	connection.query(query_string, function(error, rows, fields){
			if(!!error) {
				io.sockets.emit("view_all_user",{"success" : false,"data" : error});
			} else {
				io.sockets.emit("view_all_user",{"success" : true});
			}
		});

	});

});



