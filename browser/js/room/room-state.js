app.config( $stateProvider => {
	$stateProvider.state('room', {
		url: '/room/:roomId',
		templateUrl: '/js/room/room-template.html',
		controller: 'RoomCtrl',
		resolve: {
			room(RoomFactory, $stateParams, PlaylistFactory) {
				return RoomFactory.getRoomById( $stateParams.roomId )
						.then(room => {
							PlaylistFactory.setPlaylist(room.playlist);
							return room;
						});
			},
			user(AuthService) {
				return AuthService.getLoggedInUser()
						.then(user => user);
			}
		}
	})
})
.controller('RoomCtrl', ($scope, room, user, PlaylistFactory) => {
		$scope.playlist = PlaylistFactory.getPlaylist();
		$scope.room = room;
		$scope.user = user;
});
