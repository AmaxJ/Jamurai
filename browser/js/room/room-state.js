app.config(function($stateProvider) {
	$stateProvider.state('room', {
		url: '/room/:roomId',
		templateUrl: '/js/room/room-template.html',
		controller: 'RoomCtrl',
		resolve: {
			room: function ( RoomFactory, $stateParams) {
				return RoomFactory.getRoomById( $stateParams.roomId );
			}
		}
	})
}).controller('RoomCtrl', function ($scope, room) {
		$scope.room = room;
})
