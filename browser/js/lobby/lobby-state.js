let geo = navigator.geolocation;

app.config($stateProvider => {
    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html',
        controller: 'LobbyCtrl',
        resolve: {
        	user: (AuthService) => {
        		return AuthService.getLoggedInUser()
        				// .then(function(user){
                        //     geo.getCurrentPosition(function(position){
                        //         console.log('poz',position);
                        //         var coords = [position.coords.latitude,position.coords.longitude];
                        //         return UserFactory.updateUser(user._id,{coordinates: coords})

                        //     })
                        // })
        	},
            rooms: (RoomFactory) => {
                return RoomFactory.getAllRooms();
            }
        }
    })

}).controller('LobbyCtrl', ($scope, user, rooms) => {
    $scope.user = user;
    $scope.rooms = rooms;

});

