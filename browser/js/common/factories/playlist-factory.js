app.factory('PlaylistFactory', function($http,$rootScope, SocketFactory) {
	var factory = {};
    var playlist;
	var playlistId;
    var currentlyPlayingSong;
	var socket = SocketFactory.getSocket();

    var findSongAndReturn = function(song) {
        var youtubeId = song.id.videoId;
        return $http.get('/api/songs/yid/' + youtubeId)
            .then(function(song) {
                return song.data;
            });
    };

    var addSongToDb = function(song) {
        console.log(song);
        var newSong = {
            title : song.snippet.title,
            youTubeId : song.id.videoId,
            youTubeChannel : song.snippet.channelTitle,
            publishedAt : song.snippet.publishedAt,
            thumbnails : song.snippet.thumbnails
        }
        return $http.post('/api/songs', newSong)
            .then(function(song) {
                return song.data;
            });
    };

    factory.createPlaylist = function() {
        return $http.post('/api/playlists', {})
            .then(function(response) {
                playlistId = response.data._id;
                return response.data._id;
            });
    };

    //TODO change this
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

    factory.addSong = function(song) {
        return findSongAndReturn(song)
            .then(function(songFromDb) {
                if (!songFromDb) {
                    return addSongToDb(song);
                }
                return songFromDb;
            })
            .then(function(song) {
                return $http.put('/api/playlists/' + playlistId, {
                    song : song
                });
            })
            .then(null, console.error.bind(console));
    };

    factory.sort = function() {
        playlist.sort(function(a, b) {
            return b.voteValue - a.voteValue;
        });
    };

    factory.vote = function($event, song, vote) {
        SocketFactory.emitVote({song: song, voteType: vote})
    };

    factory.setPlaylist = function(id) {
        playlistId = id;
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
