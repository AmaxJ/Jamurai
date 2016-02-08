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
    .controller('RoomCtrl', ($scope, $rootScope, room, user, RoomFactory, SocketFactory, PlaylistFactory, UserFactory, PowerupFactory) => {

        let sortScores = () => {
            $scope.room.userScores.sort((a, b) => {
                return b.score - a.score;
            });
        }

        var socket = SocketFactory.getSocket();
        $scope.room = room;
        $scope.user = user;

        $scope.powerupObj;
        UserFactory.getPowerUps(user._id, room._id)
        .then(powerups => {
            $scope.powerupObj = powerups;
        })

        $scope.usePowerUp = (powerup,user,room) => {
            PowerupFactory.usePowerup(powerup,user,room);
        }

        socket.on('updateUsers', function(room) {
            $scope.room = room;
            sortScores();
            $rootScope.$digest();
        })

        socket.on('updateVotes', function(updateObj) {
            $scope.room = updateObj.updatedRoom;
            sortScores();
            $scope.$digest();
        })

         socket.on('updatePowerups', function(updatedPowerups) {

            if(updatedPowerups.user === user._id) {
                $scope.powerupObj = updatedPowerups;
                $scope.$digest();
            }
        })

         socket.on('updateRoom', updateObj => {
            var room = updateObj.room;
            $scope.room = room;
            $scope.$digest();
         })

        $scope.playlist = PlaylistFactory.getPlaylist;

        RoomFactory.addUserEmit(room._id, user._id);

    });
