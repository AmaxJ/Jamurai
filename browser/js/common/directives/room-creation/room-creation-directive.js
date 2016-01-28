app.directive('createRoom', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/room-creation/room-creation-template.html',
		controller: 'RoomFormCtrl'
	}
})

app.controller('RoomFormCtrl', function($scope, RoomFactory){
	$scope.newRoom = {
        roomName: null,
        roomPrivacy: null
    }
	$scope.getRoomState = RoomFactory.getRoomState;
	$scope.showForm = RoomFactory.showForm;
	$scope.createNewRoom = function() {
			RoomFactory.createNewRoom($scope.newRoom)
			.then(function(){
				$scope.newRoom = {
			        ame: null,
			        privacy: null,
			        location: null,
			        ambassadors: []
	    		}
			})
	}
		
})