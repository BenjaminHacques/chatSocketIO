var commands = require('./src/commands.js');

function chat(msg, io, socket) {
	if (msg.match(/^\//)) {
		/* Command */
		var values = msg.replace(/^\//, '');
		values = values.split(' '); //get all parameters in a array
		var command = values.splice(0,1)[0]; //get the command in a string
		if (typeof commands[command] === 'function') {
			commands[command](values, io, socket); //execute command string
		} else {
			var messErr = command+' is not a valid command.';
			socket.emit('chat system', messErr);
		}

	} else if(socket.pseudo) {
		/* classic message */
		var msgWithName = socket.pseudo+' > '+msg;
		console.log('message: '+msgWithName);
	    io.emit('chat message', msgWithName);

	} else {
		/* unidentified user */
		var errorUnameMsg = 'You need to enter your name using /name (20 chars max)';
		socket.emit('chat system', errorUnameMsg);
	}
};

module.exports = chat;