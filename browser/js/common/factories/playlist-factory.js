app.factory('PlaylistFactory', function($http) {

    var factory = {};
    var playlist = [];

	factory.populateSongs = function () {
		return $http.get('/api/songs/')
		.then(function(songs){
            songs.data.forEach(function(song) {
                song.voteValue = 0;
            });
            playlist = songs.data;
		});
	};

    factory.sort = function() {
        playlist.sort(function(a, b) {
            return b.voteValue - a.voteValue;
        });
    };

    factory.vote = function($event, song, vote) {
        $event.stopPropagation();
        if (vote === 'up') song.voteValue += 1;
        else if (vote === 'down') song.voteValue -= 1;
        factory.sort();
    };

    factory.getPlaylist = function() {
        return playlist;
    };

	return factory;
})
