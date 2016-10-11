module.exports =
{
	/**
	 * exemple: /name Harry Cover
	 * Set a new name to this socket with 20 chars max nad the name must be unique
	 */
    name: function(values, io, socket) {
    	var pseudo = '';
    	values.forEach(function(val) {
    		if (pseudo !== '') {
    			pseudo += ' ';
    		}
    		pseudo += val;
    	});
    	if (pseudo.match(/^\S.{0,20}$/)) {

    		//check if this pseudo is unique
    		var dispo = true;
    		Object.keys(io.myChat.users).forEach(function(id) {
		    	if (pseudo === io.myChat.users[id].pseudo) {
		    		dispo = false;
		    	}
			});


    		if (dispo) {
    			//message system
	    		if(io.myChat.users[socket.id].pseudo) {
					var msgName = io.myChat.users[socket.id].pseudo+' become '+pseudo;
				} else {
					var msgName = 'New user: '+pseudo;
				}
				io.emit('chat system', msgName);

				//set pseudo
				io.myChat.users[socket.id].pseudo = pseudo;
				io.emit('chat refresh', io.myChat.users);
			}
			else {
				socket.emit('chat system', 'Unavailable name.');
			}

	    } else {
	    	var msgErr = 'Enter your name (20 chars max) using: /name YourName';
    		socket.emit('chat system', msgErr);
	    }
    },




	/**
	 * exemple: /img http://weknowyourdreams.com/images/space/space-04.jpg
	 * Display image from url
	 */
    img: function(values, io, socket) {
    	if (io.myChat.users[socket.id].pseudo) {
			var user = io.myChat.users[socket.id].pseudo+' > ';
			var img = values[0];
			console.log('image: ' +user+img);
		    io.emit('chat image', {img:img,user:user});
		} else {
			var msgErr = 'You need to enter your name using /name (20 chars max)';
    		socket.emit('chat system', msgErr);
		}
    },

    /**
     * same as /img
     */
    image: function(values, io, socket) {this.img(values, io, socket);},




    /**
     * exemple: /w Harry Hello man!
	 * Send private message to another user
	 * !!! Target username cannot contain spaces
     */
    w: function(values, io, socket) {
    	if (io.myChat.users[socket.id].pseudo) {
	    	var targetUser = values[0];
	    	//set the full msg with all other values
	    	var msg = '';
			for (var i = 1; i < values.length; i++) {
	    		if (msg !== '') {
	    			msg += ' ';
	    		}
	    		msg += values[i];
	    	};

	    	//foreach sockets to find target id
	    	var isSend = false;
			Object.keys(io.myChat.users).forEach(function(id) {
			    if (io.myChat.users[id].pseudo && io.myChat.users[id].pseudo === targetUser) {
			    	//target find
			    	var from = io.myChat.users[socket.id].pseudo;
			    	socket.broadcast.to(id).emit('chat wisp', {msg:msg,from:from});
			    	socket.emit('chat wisp to', {msg:msg,target:targetUser});
			    	isSend = true;
			    	return(true);
			    }
			});
			if (!isSend) {
				var msgErr = "Can't find user "+targetUser;
				socket.emit('chat system', msgErr);
			}
		} else {
			var msgErr = 'You need to enter your name using /name (20 chars max)';
    		socket.emit('chat system', msgErr);
		}
    },




    /**
     * exemple: /help
	 * Display list of all these commands
     */
    help: function(values, io, socket) {
    	var commands = [
						'/color myColor >> Set a color for your messages',
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




    /**
     * exemple: /color red (or hexadecimal color)
	 * Set your new message color
     */
    color: function(values, io, socket) {
    	if (io.myChat.users[socket.id].pseudo) {
			io.myChat.users[socket.id].color = values[0];
    		socket.emit('chat system', 'You are now using color: '+values[0]);
		} else {
			var msgErr = 'You need to enter your name using /name (20 chars max)';
    		socket.emit('chat system', msgErr);
		}
    },


}