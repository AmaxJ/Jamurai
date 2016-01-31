app.factory('PlaylistFactory', function($http,$rootScope, SocketFactory) {
	var factory = {};
	var playlist = [];
    var currentlyPlayingSong;
	var socket = SocketFactory.getSocket();

	factory.populateSongs = function () {
		return $http.get('/api/songs/')
		.then(function(songs){
            songs.data.forEach(function(song) {
                song.voteValue = song.totalUpVotes-song.totalDownVotes;
            });
            playlist = songs.data;
            factory.sort();
		});
	};


    factory.sort = function() {
        playlist.sort(function(a, b) {
            return b.voteValue - a.voteValue;
        });
    };

    factory.vote = function($event, song, vote) {
        $event.stopPropagation();
        SocketFactory.emitVote({song: song, voteType: vote})
    };

    factory.getPlaylist = function() {
        return playlist;
    };

    factory.getVoteValue = function(song) {
    	return song.voteValue;
    }

    factory.setCurrentSong = function(song) {
        currentlyPlayingSong = song;
    }

    factory.getCurrentSong = function() {
        return currentlyPlayingSong;
    }

    socket.on('updateVotes', function(vote){
    	var song = vote.song;
        var songId = song._id;
        var songUrl = '/api/songs/'+songId;
    	var songToUpdate = _.find(playlist, function(o){
    		return o.title ===song.title;
    	})
    	if(vote.voteType === 'up') {
           song.totalUpVotes++;
        }
        if(vote.voteType === 'down') {
           song.totalDownVotes++;
        }
        return $http.put(songUrl,song)
        .then(function(song){
            return $http.get(songUrl)
        })
        .then(function(song){
            factory.populateSongs();
            if(!$rootScope.$$phase)
            {
                $rootScope.$digest();
            }
        })
    })

	return factory;
})
