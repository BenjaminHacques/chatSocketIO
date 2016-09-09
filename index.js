var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var chat = require('./myModules/chat/app.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	
  console.log('user connected');
  var welcomeMsg = 'Welcome, use /name select your name and /help to see all available commands.'
  socket.emit('chat system', welcomeMsg);

  socket.on('disconnect', function(){
  	if (socket.pseudo) {
  		var discMsg = socket.pseudo+' disconnected';
		  console.log(discMsg);
		  socket.broadcast.emit('chat system', discMsg);
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