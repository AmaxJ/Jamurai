app.config($stateProvider => {
        $stateProvider.state('room', {
            url: '/room/:roomId',
            templateUrl: '/js/room/room-template.html',
            controller: 'RoomCtrl',
            resolve: {
                room(RoomFactory, $stateParams, PlaylistFactory) {
                        return RoomFactory.getRoomById($stateParams.roomId)
                            .then(room => {
                                PlaylistFactory.setPlaylist(room.playlist);
                                return room;
                            });
                    },
                    user(AuthService) {
                        return AuthService.getLoggedInUser()
                            .then(user => user);
                    }
            },
            onExit: function(user, room, RoomFactory) {
                RoomFactory.removeUserEmit(room._id, user._id);
            }
        })
    })
    .controller('RoomCtrl', ($scope, room, user, RoomFactory, SocketFactory, PlaylistFactory) => {

        var socket = SocketFactory.getSocket();

        socket.on('updateUsers', function(room) {
            $scope.room = room;
            $scope.$digest();
        })

        socket.on('updateVotes', function(updateObj) {
            $scope.room = updateObj.updatedRoom;
            $scope.$digest();
        })

        $scope.room = room;
        $scope.user = user;
        $scope.playlist = PlaylistFactory.getPlaylist();

        RoomFactory.addUserEmit(room._id, user._id);

    });
