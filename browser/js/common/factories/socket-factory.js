app.factory('SocketFactory', function() {
        if (!window.io) throw new Error('socket.io not found!');
        
        var socket = io.connect(window.location.origin);

        var factory = {};

        factory.emitVote = function(payload){
        	socket.emit('vote', payload);
        }

        factory.getSocket = function(){
        	return socket;
        }


        return factory;
    });