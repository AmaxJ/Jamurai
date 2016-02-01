app.directive('createRoom', function() {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/room-creation/room-creation-template.html',
        controller: 'RoomFormCtrl'
    }
})

app.controller('RoomFormCtrl', function($scope, RoomFactory, $state) {
    $scope.newRoom = {
        creator: $scope.user._id,
        name: null,
        isPrivate: null,
        location: null
    }
    $scope.getRoomState = RoomFactory.getRoomState;
    $scope.showForm = RoomFactory.showForm;
    $scope.createNewRoom = function() {
        RoomFactory.createNewRoom($scope.newRoom)
            .then(newRoom => {
                console.log("newRoom", newRoom);
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
