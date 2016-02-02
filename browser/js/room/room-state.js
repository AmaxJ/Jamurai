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
.controller('RoomCtrl', ($scope, PlaylistFactory, room, user) => {
        PlaylistFactory.setPlaylist(room.playlists[0]._id)
		$scope.room = room;
		$scope.user = user;
        var roomPlaylist = room.playlists[0].songs;

        $scope.songs = function() {
            return roomPlaylist;
        };
});
