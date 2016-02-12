app.factory('RoomFactory', ($http, PlaylistFactory, $rootScope, SocketFactory) => {
    let roomState
    let factory = {};
    let socket = SocketFactory.getSocket();

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
            .then(response => {
                return response.data;
            })
    };

    factory.getRoomById = roomId => {
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

    factory.setRoomState = state => {
        roomState = state;
    }

    factory.getRoomState = () => {
        return roomState;
    }

    return factory;
});
