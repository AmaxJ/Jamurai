app.config($stateProvider => {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
})

app.controller('HomeCtrl', ($scope, PlayerFactory,PlaylistFactory) => {

    $scope.play = PlayerFactory.play;
    $scope.pause = PlayerFactory.pause;
    $scope.mute = PlayerFactory.mute;
    $scope.songs = PlaylistFactory.getPlaylist;

});
