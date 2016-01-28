app.factory('PlaylistFactory', function($http,$rootScope) {
	var factory = {};
	var socket = io.connect(window.location.href);
	factory.getAllSongs = function () {
		return $http.get('/api/songs/')
		.then(function(songs){
            songs.data.forEach(function(song) {
                song.voteValue = 0;
            });
			return songs.data;
		});
	};

    factory.vote = function($event, song, vote) {
    	socket.emit('vote', {song: song, voteType: vote});
        $event.stopPropagation();
        if(vote === 'up') song.voteValue++;
        if(vote === 'down') song.voteValue--;
    };

    factory.getVoteValue = function(song) {
    	return song.voteValue;
    }

    socket.on('updateVotes', function(vote){
    	console.log('Ready to update votes', vote);
    	var song = vote.song;
    	if(vote.voteType === 'up') song.voteValue++;
        if(vote.voteType === 'down') song.voteValue--;
        console.log('Updated?', song)
        $rootScope.$digest();
    })

	return factory;
})
