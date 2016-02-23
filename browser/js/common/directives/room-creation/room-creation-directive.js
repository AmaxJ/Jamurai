app.directive('createRoom', () => {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/room-creation/room-creation-template.html',
        controller: 'RoomFormCtrl'
    }
})

app.controller('RoomFormCtrl', ($scope, RoomFactory, $state) => {
    let showForm = false;
    $scope.newRoom = {
        creator: $scope.user._id,
        name: null,
        location: null,
        playlists: []
    }
    $scope.getRoomState = () => showForm;
    $scope.showForm = () => {
        showForm = !showForm;
    }
    $scope.createNewRoom = () => {
        $scope.newRoom.isPrivate = $scope.newRoom.isPrivate || false;
        RoomFactory.createNewRoom($scope.newRoom)
            .then(newRoom => {
                $state.go('room', {roomId: newRoom._id});
            })
            .then(null, console.error.bind(console));
    }

});
