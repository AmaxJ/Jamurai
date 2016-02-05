app.config(function($stateProvider) {
    $stateProvider.state('submit-song', {
        url: '/submit-song/:roomId',
        templateUrl: 'js/submit-song/submit-song-template.html',
        resolve: {
            user(AuthService) {
                return AuthService.getLoggedInUser()
                    .then(user => user);
            },
            room(RoomFactory, $stateParams) {
                return RoomFactory.getRoomById($stateParams.roomId)
            }
        },
        controller($scope, user, room) {
            $scope.user = user;
            $scope.room = room;
            console.log($scope.room)
        }
    })
})
