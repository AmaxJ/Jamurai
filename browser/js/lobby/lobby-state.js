app.config($stateProvider => {
    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html',
        controller: 'LobbyCtrl',
        resolve: {
        	user(AuthService) {
        		return AuthService.getLoggedInUser();
        	},
            rooms(RoomFactory) {
                return RoomFactory.getAllRooms();
            }
        }
    })

})

app.controller('LobbyCtrl', ($scope, user, rooms) => {
    $scope.user = user;
    $scope.rooms = rooms;

});

