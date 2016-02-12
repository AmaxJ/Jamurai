app.factory('SocketFactory', () => {
        if (!window.io) throw new Error('socket.io not found!');

        let socket = io.connect(window.location.origin);

        let factory = {};

        factory.emitVote = (payload) => {
        	socket.emit('vote', payload);
        }

        factory.getSocket = () => {
        	return socket;
        }


        return factory;
    });
