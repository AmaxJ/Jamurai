var geo = navigator.geolocation;

app.config(function($stateProvider) {
    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html',
        controller: 'LobbyCtrl',
        resolve: {
        	user: function (AuthService) {
        		return AuthService.getLoggedInUser()
        				// .then(function(user){
                        //     geo.getCurrentPosition(function(position){
                        //         console.log('poz',position);
                        //         var coords = [position.coords.latitude,position.coords.longitude];
                        //         return UserFactory.updateUser(user._id,{coordinates: coords})

                        //     })
                        // })
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

