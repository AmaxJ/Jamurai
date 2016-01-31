app.directive('createRoom', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/room-creation/room-creation-template.html',
		controller: 'RoomFormCtrl'
	}
}).controller('RoomFormCtrl', function($scope, RoomFactory, $state){

	$scope.newRoom = {
		//creator field just for testing... remove later
		//normally will be: user._id
		creator: "56ab95583c716b49114954ec",
        name: null,
        privacy: null,
        location: null,
        ambassadors: []
    }

	$scope.getRoomState = RoomFactory.getRoomState;
	$scope.showForm = RoomFactory.showForm;
	$scope.createNewRoom = () => {
			RoomFactory.createNewRoom($scope.newRoom)
			.then((newRoom) => {
				$state.go('room', {roomId: newRoom._id});
			})
			.then(() => {
				$scope.newRoom = {
			        name: null,
			        privacy: null,
			        location: null,
			        ambassadors: []
	    		}
			})
	}
		
})