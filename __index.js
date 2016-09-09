var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	
  console.log('a user connected');

  socket.on('disconnect', function(){
  	if (socket.pseudo) {
  		var discMsg = socket.pseudo+' disconnected';
		console.log(discMsg);
		socket.broadcast.emit('chat message', discMsg);
  	} else {
    	console.log('anonyme user disconnected');
    }
  });

  socket.on('chat message', function(msg){
  	if (msg.match(/^\//)) {
  		//commands
  		if (msg.match(/^\/name\s\S.{0,20}$/)) {
  			// reame command
  			var pseudo = msg.replace(/\/name\s/, '');
			if(socket.pseudo) {
				var msgName = socket.pseudo+' become '+pseudo;
			} else {
				var msgName = 'New user: '+pseudo;
			}
			socket.pseudo = pseudo;
			io.emit('chat message', msgName);
/*
		} else if (msg.match(/^\/users$/)) {
			//not working
			Object.keys(io.sockets.sockets).forEach(function(id) {
			    console.log("ID:",id)  // socketId
			})*/

		} else if (msg.match(/^\/help$/)) {
			var commands = ['/name YourName >> 20 characters max',
							'/help >> return all availables commands',
							'img MyUrl >> display image from the url'];
			var helpMsg = '========= Commands List:';
			socket.emit('chat message', helpMsg);
			commands.forEach(function(command){
				socket.emit('chat message', command);
			}); 

  		} else {
  			var errorCommandeMsg = 'Unknow command';
			socket.emit('chat message', errorCommandeMsg);
  		}
  	} else if(socket.pseudo) {
  		if (msg.match(/^img\s/)) {
  			//image
  			var img = msg.replace(/^img\s/, '');
  			var user = socket.pseudo+' > ';
			console.log('image: ' +user+img);
		    io.emit('chat image', {img,user});
  		} else {
  			//normal message
			var msgWithName = socket.pseudo+' > '+msg;
			console.log('message: ' +msgWithName);
		    io.emit('chat message', msgWithName);
		}
	} else {
		var errorUnameMsg = 'You need to enter your name using /name (20 chars max)';
		socket.emit('chat message', errorUnameMsg);
	}
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});