app.factory('RoomFactory', function($http, PlaylistFactory, $rootScope, SocketFactory) {
    var factory = {};
    var socket = SocketFactory.getSocket();

    factory.createNewRoom = newRoom => {
        return PlaylistFactory.createPlaylist()
            .then(playlist => {
                newRoom.playlists = [playlist];
                return $http({
                    method: 'POST',
                    url: '/api/rooms/',
                    data: newRoom
                })
            })
            .then(room => room.data);
    }

    factory.getAllRooms = () => {
        return $http({
                method: 'GET',
                url: '/api/rooms/'
            })
            .then((response) => {
                return response.data;
            })
    };

    factory.getRoomById = (roomId) => {
        return $http({
                method: 'GET',
                url: '/api/rooms/' + roomId
            })
            .then(response => response.data);
    };

    factory.addUser = (roomId, userId) => {
        socket.emit("userEntered", {
            roomId: roomId,
            userId: userId,
        })
    }

    factory.removeUser = (roomId, userId, scoreObjId) => {
        socket.emit('userLeft', {
            roomId: roomId,
            userId: userId,
            scoreObjId: scoreObjId
        });
    }
    // factory.removeUserEmit = (roomId, userId, scoreObjId) => {
    //     SocketFactory.emitUserRemove(roomId, userId, scoreObjId);
    // }

    return factory;
});
