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
.controller('RoomCtrl', ($scope, room, user) => {
		$scope.room = room;
		$scope.user = user;
        $scope.songs = () => room.playlist.songs;
        $scope.getVoteValue = (song) => {
            console.log("called me!!!")
            return room.playlist.songData[song._id];
        }
});
