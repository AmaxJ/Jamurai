app.config(function($stateProvider) {
    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html'
    })
})

app.controller('LobbyCtrl', ($scope) => {
    $scope.newRoom = {
        roomName: null,
        roomPrivacy: null
    }
})
