app.directive('createRoom', function(){
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/room-creation/room-creation-template.html',
		controller: 'RoomFormCtrl'
	}
}).controller('RoomFormCtrl', function($scope, RoomFactory, $state, user){

	let user = user;
	console.log('from roomForm', user);

	$scope.newRoom = {
		//creator field just for testing... remove later
		//normally will be: user._id
		creator: '0823082308423',
        name: null,
        privacy: null,
        location: null,
        ambassadors: []
    }
    console.log($scope.newRoom);
    console.log('in the form controller')

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