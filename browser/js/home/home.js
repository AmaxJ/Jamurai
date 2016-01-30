app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        resolve: {
        	loadSongs: function (PlaylistFactory) {
        		return PlaylistFactory.populateSongs();
        	}
        }
    });
})

app.controller('HomeCtrl', ($scope, PlayerFactory, loadSongs,PlaylistFactory) => {

    $scope.play = PlayerFactory.play;
    $scope.pause = PlayerFactory.pause;
    $scope.mute = PlayerFactory.mute;
    $scope.songs = PlaylistFactory.getPlaylist;

})
