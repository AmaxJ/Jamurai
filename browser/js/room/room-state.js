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
            onExit: function(user, RoomFactory) {
                let room = RoomFactory.getRoomState();
                let scoreObj = room.userScores.filter(scoreObj => {
                    return scoreObj.user._id === user._id;
                })[0];
                RoomFactory.removeUser(room._id, user._id, scoreObj._id);
            }
    }
    .controller('RoomCtrl', ($scope, $rootScope, room, user, powerups, RoomFactory, SocketFactory, PlaylistFactory, UserFactory, PowerupFactory, PlayerFactory, $timeout) => {

        let sortScores = () => {
            $scope.room.userScores.sort((a, b) => {
                return b.score - a.score;
            });
        }

        $scope.sidebarHeight = () => {
            return {
                'height': '100%'
            powerups(PowerupFactory, user, room) {
                return PowerupFactory.getPowerups(user._id, room._id)
            }
        },
        onEnter(room, user, RoomFactory) {
            RoomFactory.addUser(room._id, user._id);
        },
        onExit(user, RoomFactory) {
            let room = RoomFactory.getRoomState();
            let scoreObj = room.userScores.filter(scoreObj => {
                return scoreObj.user._id === user._id;
            })[0];
            RoomFactory.removeUser(room._id, user._id, scoreObj._id);
        }
    })
});

app.controller('RoomCtrl', ($scope, $rootScope, room, user, powerups, RoomFactory, SocketFactory, PlaylistFactory, UserFactory, PowerupFactory, PlayerFactory) => {
    let sortScores = () => {
        $scope.room.userScores.sort((a, b) => {
            return b.score - a.score;
        });
    }
    $scope.sidebarHeight = () => {
        return {
            'height': '100%'
        }
    }
    let socket = SocketFactory.getSocket();
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
        let room = updateObj.room;
        RoomFactory.setRoomState(room);
        $scope.room = room;
        sortScores();
        $scope.$digest();
    })
    $scope.playlist = PlaylistFactory.getPlaylist;
});
