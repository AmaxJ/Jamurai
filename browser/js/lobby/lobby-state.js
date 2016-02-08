app.config(function($stateProvider) {
    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html',
        controller: 'LobbyCtrl',
        resolve: {
        	user: function (AuthService) {
        		return AuthService.getLoggedInUser()
        				.then(user=> user)
        	},
            rooms: function (RoomFactory) {
                return RoomFactory.getAllRooms();
            }
        }
    })
}).controller('LobbyCtrl', ($scope, user, rooms) => {
    $scope.user = user;
    $scope.rooms = rooms;

});

