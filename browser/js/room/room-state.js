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
            onExit: function(user, room, RoomFactory) {
                RoomFactory.removeUserEmit(room._id, user._id);
            }
        })
    })
    .controller('RoomCtrl', ($scope, $rootScope, room, user, powerups, RoomFactory, SocketFactory, PlaylistFactory, UserFactory, PowerupFactory, PlayerFactory) => {

        let sortScores = () => {
            $scope.room.userScores.sort((a, b) => {
                return b.score - a.score;
            });
        }

        let powerUpIcons = {
            'Chopsticks of Plenty': '/food.svg',
            'Sword of Ultimate Shame': '/twoswords.svg',
            'Daggers of Disdain': '/daggerSolid.svg',
            'Katana of Disgrace': '/sword.svg',
            'Enlightened Blessing': '/discipline.svg',
            'Sword of Uncertainty': '/yinyang.svg',
            'Poison Darts': '/darts.svg',
            'The Last Jamurai': '/helmet.svg'
        }

        let formatPowerUps = powerUpObj => {
            return powerUpObj.powerups.map(powerup => {
                let pwrUp = {};
                pwrUp.name = powerup;
                pwrUp.icon = powerUpIcons[powerup];
                return pwrUp;
            });
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


        console.log('Scope powerups', $scope.powerups)

        $scope.startPlaylist = PlayerFactory.startPlaylist;

        $scope.currentlyPlaying = PlaylistFactory.getCurrentSong;


        // PowerupFactory.getPowerups(user._id, room._id)
        // .then(powerUpObj => {
        //     $scope.powerUps = formatPowerUps(powerUpObj)
        // })
        // $scope.powerUps = formatPowerUps(PowerupFactory.getActivePowerups());
        

        $scope.usePowerUp = (powerup, user, room) => {
            PowerupFactory.usePowerup(powerup, user, room);
        }

        // socket.on('updateUsers', function(room) {
        //     $scope.room = room;
        //     sortScores();
        //     $rootScope.$digest();
        // })

        socket.on('updateVotes', function(updateObj) {
            $scope.room = updateObj.updatedRoom;
            sortScores();
            $scope.$digest();
        })

        socket.on('updatePowerups', function(updatedPowerups) {

            if (updatedPowerups.user === user._id) {
                $scope.powerUps = formatPowerUps(updatedPowerups);
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
