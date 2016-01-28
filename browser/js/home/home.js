app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
})

.controller('HomeCtrl', ($scope, PlayerFactory) => {

    $scope.play = PlayerFactory.play;
    $scope.pause = PlayerFactory.pause;
    $scope.mute = PlayerFactory.mute;

})
