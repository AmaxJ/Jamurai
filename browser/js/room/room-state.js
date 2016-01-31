app.config(function($stateProvider) {
	$stateProvider.state('room', {
		url: '/room/:roomId',
		templateUrl: '/js/room/room-template.html',
		controller: 'RoomCtrl',
		resolve: {
			room: function ( RoomFactory, $stateParams) {
				return RoomFactory.getRoomById( $stateParams.roomId );
			},
			user: function (AuthService) {
				return AuthService.getLoggedInUser()
						.then((user)=> {
							return user;
						});
			}
		}
	})
}).controller('RoomCtrl', function ($scope, room, user) {
		console.log(user);
		$scope.room = room;
		$scope.user = user;
})
