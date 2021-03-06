var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chat = require('./myModules/chat/app.js');

// all custom datas
io.myChat = {users: {}};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  // all personnal datas from this user (ex: color, pseudo)
  io.myChat.users[socket.id] = {};
  io.myChat.users[socket.id].color = '#000000';

  console.log('user connected');
  socket.emit('chat system', '欢迎 Welcome, use /name select your name and /help to see all available commands.');

  socket.on('disconnect', function(){
  	if (io.myChat.users[socket.id].pseudo) {
  		var discMsg = io.myChat.users[socket.id].pseudo+' disconnected';
		  console.log(discMsg);
		  socket.broadcast.emit('chat system', discMsg);
      delete io.myChat.users[socket.id];
      io.emit('chat refresh', io.myChat.users);
  	} else {
    	console.log('anonyme user disconnected');
    }
  });

  socket.on('chat message', function(msg){
  	chat(msg, io, socket);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/*
TODO
- look for global variables
- show all users in index.html
- unique pseudo
- better autoscroll when img are posted
- personnal color
- see if there is better place for var pseudo
- add mongodb to stock pseudos and colors
- return to line if message is longer than windows (when you have 1 single word)
- style user > msg to get all umessage align vertically (like in array)
*/