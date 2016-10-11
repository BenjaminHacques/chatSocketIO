var commands = require('./src/commands.js');

function chat(msg, io, socket) {

	/* ================= Command ==================== */
	if (msg.match(/^\//)) {
		
		var values = msg.replace(/^\//, '');
		values = values.split(' '); //get all parameters in a array
		var command = values.splice(0,1)[0]; //get the command in a string
		
		if (typeof commands[command] === 'function') {
			commands[command](values, io, socket); //execute command string
		} else {
			var messErr = command+' is not a valid command.';
			socket.emit('chat system', messErr);
		}


	/* ================= Message ==================== */
	} else if(io.myChat.users[socket.id].pseudo) {
		
		console.log('message: '+io.myChat.users[socket.id].pseudo+' > '+msg);
		var data = {
			pseudo: io.myChat.users[socket.id].pseudo,
			msg: msg,
			color: io.myChat.users[socket.id].color
		};
	    io.emit('chat message', data);




	/* ================= Unidentified user ==================== */
	} else {
		var errorUnameMsg = 'You need to enter your name using /name (20 chars max)';
		socket.emit('chat system', errorUnameMsg);
	}
};

module.exports = chat;