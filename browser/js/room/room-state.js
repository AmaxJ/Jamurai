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
		$scope.songs = [];
		$scope.room = room;
		$scope.user = user;
		PlaylistFactory.setPlaylist(room.playlist._id)
		PlaylistFactory.getRoomPlaylist()
		.then(()=>{
			return PlaylistFactory.getPlaylist()
		})
		.then(newSongs =>{
			$scope.songs = newSongs;
		})
        // $scope.getVoteValue = (songObj) => {
        // 	console.log('GETTING VOTE', songObj)
        //     return songObj.total;
        // }
});
