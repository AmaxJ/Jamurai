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
                                console.log(room);
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
    .controller('RoomCtrl', ($scope, room, user, RoomFactory, SocketFactory, PlaylistFactory, UserFactory, PowerupFactory) => {

        var socket = SocketFactory.getSocket();
        $scope.room = room;
        $scope.user = user;

        $scope.powerupObj; 
        UserFactory.getPowerUps(user._id, room._id)
        .then(powerups => {
            $scope.powerupObj = powerups;
        })

        $scope.usePowerUp = (powerup,user,room) => {
            PowerupFactory.usePowerup(powerup);
            socket.emit('usePowerUp', {powerup: powerup, user: user,room: room});
        }

        socket.on('updateUsers', function(room) {
            $scope.room = room;
            $scope.$digest();
        })

        socket.on('updateVotes', function(updateObj) {
            $scope.room = updateObj.updatedRoom;
            $scope.$digest();
        })

         socket.on('updatePowerups', function(updatedPowerups) {

            if(updatedPowerups.user === user._id) {
                $scope.powerupObj = updatedPowerups;
                $scope.$digest();    
            }
        })

        $scope.playlist = PlaylistFactory.getPlaylist();

        RoomFactory.addUserEmit(room._id, user._id);

    });
