app.config( $stateProvider => {
	$stateProvider.state('room', {
		url: '/room/:roomId',
		templateUrl: '/js/room/room-template.html',
		controller: 'RoomCtrl',
		resolve: {
			room(RoomFactory, $stateParams) {
				return RoomFactory.getRoomById( $stateParams.roomId );
			},
			user(AuthService) {
				return AuthService.getLoggedInUser()
						.then(user => user);
			}
		}
	})
})
.controller('RoomCtrl', ($scope, room, user, RoomFactory) => {
		$scope.room = room;
		$scope.user = user;
		
		//update room with users
		$scope.user = RoomFactory.addUserToRoom(user._id, room)
		
		console.log('user', $scope.user);
		console.log('room', $scope.room)
});
