app.factory('PlaylistFactory', function($http,$rootScope) {
	var factory = {};
	var playlist = [];
	var socket = io.connect(window.location.href);

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
        // if (vote === 'up') song.voteValue += 1;
        // else if (vote === 'down') song.voteValue -= 1;
        // factory.sort();
        socket.emit('vote', {song: song, voteType: vote});
    };

    factory.getPlaylist = function() {
        return playlist;
    };

    factory.getVoteValue = function(song) {
    	return song.voteValue;
    }

    socket.on('updateVotes', function(vote){
    	var song = vote.song;
    	var songToUpdate = _.find(playlist, function(o){
    		return o.title ===song.title;
    	})
    	if(vote.voteType === 'up') songToUpdate.voteValue++;
        if(vote.voteType === 'down') songToUpdate.voteValue--;
        factory.sort();
        $rootScope.$digest();
    })

	return factory;
})
