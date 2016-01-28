app.factory('PlaylistFactory', function($http) {
	var factory = {};
	factory.getAllSongs = function () {
		return $http.get('/api/songs/')
		.then(function(songs){
            songs.data.forEach(function(song) {
                song.voteValue = 0;
            });
			return songs.data;
		});
	};

    factory.vote = function($event, song, downvote) {
        $event.stopPropagation();
        downvote ? song.voteValue -= 1 : song.voteValue += 1;
    };

	return factory;
})
