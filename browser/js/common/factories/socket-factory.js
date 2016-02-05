app.factory('SocketFactory', function() {
        if (!window.io) throw new Error('socket.io not found!');

        var socket = io.connect(window.location.origin);

        var factory = {};

        factory.emitVote = function(payload){
        	socket.emit('vote', payload);
        }

        factory.emitUserAdd = function (roomId, userId) {
            socket.emit('userEntered', {roomId: roomId, userId: userId});
        }

        factory.emitUserRemove = function (roomId, userId) {
            socket.emit('userLeft', {roomId: roomId, userId: userId})
        }

        factory.getSocket = function(){
        	return socket;
        }


        return factory;
    });