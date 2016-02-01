app.directive('createRoom', function() {
    return {
        restrict: 'E',
        scope: {
            user: "="
        },
        templateUrl: 'js/common/directives/room-creation/room-creation-template.html',
        controller: 'RoomFormCtrl'
    }
})

app.controller('RoomFormCtrl', function($scope, RoomFactory) {
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
            .then(function() {
                $scope.newRoom = {
                    name: null,
                    privacy: null,
                    location: null
                }
            })
    }

})
