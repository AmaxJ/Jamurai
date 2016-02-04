app.config(function($stateProvider) {
	$stateProvider.state('songAnalytics', {
		url: '/songAnalytics',
		templateUrl: 'js/songAnalytics/songAnalytics.html',
		controller: 'songAnalyticsCtrl'
	});
})

app.controller('songAnalyticsCtrl', ($scope, PlaylistFactory) => {
	$scope.testing = 'boom';
	$scope.labels = [];
	$scope.data = [];
	$scope.series = ['Series A'];
	return PlaylistFactory.getAllSongs()
	.then(function(songs){
		songs = songs.data;
		console.log('songs',songs);
		for(var key in songs)
		{
			$scope.labels.push(songs[key].title);
			$scope.data.push(songs[key].totalUpVotes-songs[key].totalDownVotes);
		}
	})

});