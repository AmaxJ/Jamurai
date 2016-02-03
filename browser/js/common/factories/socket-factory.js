app.factory('SocketFactory', function() {
        if (!window.io) throw new Error('socket.io not found!');
        // return window.io(window.location.origin);
        var socket = io.connect(window.location.href);

        var factory = {};

        factory.emitVote = function(payload){
            console.log('Vote emitting', payload)
        	socket.emit('vote', payload);
        }

        factory.getSocket = function(){
        	return socket;
        }


        return factory;
    });