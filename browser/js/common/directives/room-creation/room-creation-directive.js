app.directive('createRoom', function(){
	return {
		restrict: 'E',
        scope : {
            user : "="
        },
		templateUrl: 'js/common/directives/room-creation/room-creation-template.html',
		controller: 'RoomFormCtrl'
	}
}).controller('RoomFormCtrl', function($scope, RoomFactory, $state){

	$scope.newRoom = {
		creator: $scope.user._id,
        name: null,
        isPrivate: null,
        location: null
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
			        location: null
	    		}
			})
	}

})
