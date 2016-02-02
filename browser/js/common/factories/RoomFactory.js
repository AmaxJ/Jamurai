app.factory('RoomFactory', function($http, PlaylistFactory) {
    var factory = {};

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
    }

    return factory;
})
