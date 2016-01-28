app.factory('SocketFactory', function() {
        if (!window.io) throw new Error('socket.io not found!');
        // return window.io(window.location.origin);
        var socket = io.connect(window.location.href);

        var factory = {};

        factory.emitVote = function(voteObj){
        	console.log('VOTEOBJ',voteObj.voteType)
        	socket.emit('vote', {song: voteObj.song, voteType: voteObj.voteType});
        }

        factory.getSocket = function(){
        	return socket;
        }


        return factory;
    });