module.exports =
{
    name: function(values, io, socket) {
    	var pseudo = '';
    	values.forEach(function(val) {
    		if (pseudo !== '') {
    			pseudo += ' ';
    		}
    		pseudo += val;
    	});
    	if (pseudo.match(/^\S.{0,20}$/)) {
    		if(socket.pseudo) {
				var msgName = socket.pseudo+' become '+pseudo;
			} else {
				var msgName = 'New user: '+pseudo;
			}
			socket.pseudo = pseudo;
			io.emit('chat system', msgName);

	    } else {
	    	var msgErr = 'Enter your name (20 chars max) using: /name YourName';
    		socket.emit('chat system', msgErr);
	    }
    },

    img: function(values, io, socket) {
    	if (socket.pseudo) {
			var user = socket.pseudo+' > ';
			var img = values[0];
			console.log('image: ' +user+img);
		    io.emit('chat image', {img,user});
		} else {
			var msgErr = 'You need to enter your name using /name (20 chars max)';
    		socket.emit('chat system', msgErr);
		}
    },

    w: function(values, io, socket) {
    	if (socket.pseudo) {
	    	var targetUser = values[0];
	    	var msg = '';
			for (var i = 1; i < values.length; i++) {
	    		if (msg !== '') {
	    			msg += ' ';
	    		}
	    		msg += values[i];
	    	};

	    	//foreach sockets to find target id
	    	var socketsIds = Object.keys(io.sockets.connected);
	    	var isSend = false;
			socketsIds.forEach(function(id) {
			    var sock = io.sockets.connected[id];
			    if (sock.pseudo && sock.pseudo === targetUser) {
			    	//target find
			    	var from = socket.pseudo;
			    	socket.broadcast.to(id).emit('chat wisp', {msg,from});
			    	isSend = true;
			    }
			});
			if (!isSend) {
				var msgErr = "Can't find user "+targetUser;
				socket.emit('chat system', msgErr);
			}
		}
    },

    help: function(values, io, socket) {
    	var commands = [
						'/help >> return all availables commands',
						'/img MyUrl >> display image from your url',
						'/name YourName >> choose your name with 20 characters max',
						'/w TargetUser My Message >> send wisp to target user with your message'
						];

		var helpMsg = '========= Commands List:';
		socket.emit('chat system', helpMsg);
		commands.forEach(function(command){
			socket.emit('chat system', command);
		});
    },


}