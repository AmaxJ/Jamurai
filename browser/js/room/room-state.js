var geo = navigator.geolocation;

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
                    },
                    powerups(PowerupFactory, user, room) {
                        return PowerupFactory.getPowerups(user._id, room._id)

                    }
            },
            onExit: function(user, RoomFactory) {
                let room = RoomFactory.getRoomState();
                let scoreObj = room.userScores.filter(scoreObj => {
                    return scoreObj.user._id === user._id;
                })[0];
                RoomFactory.removeUser(room._id, user._id, scoreObj._id);
            }
        })
    })
    .controller('RoomCtrl', ($scope, $rootScope, room, user, powerups, RoomFactory, SocketFactory, PlaylistFactory, UserFactory, PowerupFactory, PlayerFactory, $timeout) => {

        RoomFactory.addUser(room._id, user._id);

        let sortScores = () => {
            $scope.room.userScores.sort((a, b) => {
                return b.score - a.score;
            });
        }

        $scope.sidebarHeight = () => {
            return {'height': '100%'}
        }


        var socket = SocketFactory.getSocket();
        geo.getCurrentPosition(function(position) {
            var coords = [position.coords.latitude, position.coords.longitude];
            return UserFactory.updateUser(user._id, {
                coordinates: coords
            })
        });

        $scope.room = room;
        $scope.user = user;
        $scope.powerups = PowerupFactory.getActivePowerups;
        $scope.showPlaylist = true;
        $scope.toggleShowPlaylist = boolean => {
            $scope.showPlaylist = boolean;
        }
        $scope.startPlaylist = PlayerFactory.startPlaylist;

        $scope.currentlyPlaying = PlaylistFactory.getCurrentSong;

        $scope.usePowerUp = (powerup, user, room) => {
            PowerupFactory.usePowerup(powerup, user, room);
        }


        socket.on('updateRoom', updateObj => {
            var room = updateObj.room;
            RoomFactory.setRoomState(room);
            $scope.room = room;
            sortScores();
            $scope.$digest();
        })

        $scope.playlist = PlaylistFactory.getPlaylist;

    });

