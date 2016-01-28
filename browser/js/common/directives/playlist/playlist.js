app.directive('playlist', function() {
	return {
		restrict: 'E',
		templateUrl: '/js/common/directives/playlist/playlist-template.html',
		scope: {
			songs: '='
		},
		controller: function($scope, PlayerFactory) {
			// $scope.songs = PlaylistFactory.getAllSongs;
			// console.log("controller ", $scope.songs);
			$scope.loadVideoById = PlayerFactory.loadVideoById;
		}
	}
})