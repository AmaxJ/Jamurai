app.config( $stateProvider => {
	$stateProvider.state('room', {
		url: '/room/:roomId',
		templateUrl: '/js/room/room-template.html',
		controller: 'RoomCtrl',
		resolve: {
			room(RoomFactory, $stateParams, PlaylistFactory) {
				return RoomFactory.getRoomById( $stateParams.roomId )
						.then(room => {
							console.log('ROOM', room)
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
		console.log('Room Playlist', $scope.playlist)
		$scope.room = room;
		$scope.user = user;
		// PlaylistFactory.getRoomPlaylist()
		// .then(()=>{
		// 	return PlaylistFactory.getPlaylist()
		// })
		// .then(newSongs =>{
		// 	$scope.songs = newSongs;
		// })
        // $scope.getVoteValue = (songObj) => {
        // 	console.log('GETTING VOTE', songObj)
        //     return songObj.total;
        // }
});
