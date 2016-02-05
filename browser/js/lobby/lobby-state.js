var geo = navigator.geolocation;

app.config(function($stateProvider) {
    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html',
        controller: 'LobbyCtrl',
        resolve: {
        	user: function (AuthService) {
        		return AuthService.getLoggedInUser()
        				.then(function(user){
                            geo.getCurrentPosition(function(position){
                                console.log('poz',position);
                            })
                        })
        	},
            rooms: function (RoomFactory) {
                return RoomFactory.getAllRooms();
            }
        }
    })
}).controller('LobbyCtrl', ($scope, RoomFactory, user, rooms) => {
    $scope.user = user;
    $scope.rooms = rooms;
    // RoomFactory.getAllRooms()
    //     .then(rooms => {
    //         $scope.rooms = rooms;
    //         console.log(rooms);
    //     });
});


