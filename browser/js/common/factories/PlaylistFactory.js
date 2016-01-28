app.factory('PlaylistFactory', function($http) {
	var factory = {};

	factory.getAllSongs = function () {
		return $http.get('/api/songs/')
		.then(function(songs){
			console.log("factory: ", songs.data);
			return songs.data;
		})
	}
	return factory;
})