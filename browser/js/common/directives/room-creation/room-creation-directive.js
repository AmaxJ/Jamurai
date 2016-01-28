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
			return RoomFactory.createNewRoom($scope.newRoom)
			.then(function(){
				$scope.newRoom = {
			        roomName: null,
			        roomPrivacy: null
	    		}
			})
	}
		
})