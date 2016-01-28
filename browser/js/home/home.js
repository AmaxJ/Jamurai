app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        resolve: {
        	songs: function (PlaylistFactory) {
        		return PlaylistFactory.populateSongs()
                    .then(PlaylistFactory.getPlaylist);
        	}
        }
    });
})

.controller('HomeCtrl', ($scope, PlayerFactory, songs) => {

    $scope.play = PlayerFactory.play;
    $scope.pause = PlayerFactory.pause;
    $scope.mute = PlayerFactory.mute;
    console.log(songs);
    $scope.songs = songs;

})
