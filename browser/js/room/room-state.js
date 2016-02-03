app.config( $stateProvider => {
	$stateProvider.state('room', {
		url: '/room/:roomId',
		templateUrl: '/js/room/room-template.html',
		controller: 'RoomCtrl',
		resolve: {
			room(RoomFactory, $stateParams) {
				return RoomFactory.getRoomById( $stateParams.roomId )
						.then(room => room);
			},
			user(AuthService) {
				return AuthService.getLoggedInUser()
						.then(user => user);
			}
			// updatedRoom(RoomFactory, $stateParams, user) {
			// 	return RoomFactory.addUserToRoom(user._id, $stateParams.roomId)
			// 			.then((room) => {
			// 				console.log('asdfadsf', room)
			// 			});
			// }
		}
	})
})
.controller('RoomCtrl', ($scope, room, user, PlaylistFactory) => {
		$scope.room = room;
		$scope.user = user;
		console.log('ROOM', room);
		PlaylistFactory.setPlaylist(room.playlist._id)
        $scope.songs = () => room.playlist.songs;
        $scope.getVoteValue = (song) => {
            console.log("called me!!!")
            return room.playlist.songData[song._id];
        }
});
