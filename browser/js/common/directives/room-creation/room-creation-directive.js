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
        location: null,
        playlists: []
    }
    $scope.getRoomState = RoomFactory.getRoomState;
    $scope.showForm = RoomFactory.showForm;
    $scope.createNewRoom = function() {
        $scope.newRoom.isPrivate = $scope.newRoom.isPrivate || false;
        RoomFactory.createNewRoom($scope.newRoom)
            .then(newRoom => {
                $state.go('room', {roomId: newRoom._id});
            })
            .then(null, console.error.bind(console));
            // .then(() => {
            //     $scope.newRoom = {
            //         name: null,
            //         privacy: null,
            //         location: null
            //     }
            // })
    }

})
