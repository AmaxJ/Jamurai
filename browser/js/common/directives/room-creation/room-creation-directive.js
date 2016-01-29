app.directive('createRoom', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/room-creation/room-creation-template.html',
		controller: 'RoomFormCtrl'
	}
})

app.controller('RoomFormCtrl', function($scope, RoomFactory, $state, AuthService){

	let user = AuthService.getLoggedInUser();

	$scope.newRoom = {
		//creator field just for testing... remove later
		//normally will be: user._id
		creator: '0823082308423',
        name: null,
        privacy: null,
        location: null,
        ambassadors: []
    }
	$scope.getRoomState = RoomFactory.getRoomState;
	$scope.showForm = RoomFactory.showForm;
	$scope.createNewRoom = () => {
			RoomFactory.createNewRoom($scope.newRoom)
			.then(function(newRoom) {
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