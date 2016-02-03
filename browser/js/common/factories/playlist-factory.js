app.factory('PlaylistFactory', function($http, $rootScope, SocketFactory) {
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
            title: song.snippet.title,
            youTubeId: song.id.videoId,
            youTubeChannel: song.snippet.channelTitle,
            publishedAt: song.snippet.publishedAt,
            thumbnails: song.snippet.thumbnails
        }
        return $http.post('/api/songs', newSong)
            .then(function(response) {
                return response.data;
            });
    };

    factory.createPlaylist = function() {
        return $http.post('/api/playlists', {})
            .then(function(response) {
                playlistId = response.data._id;
                return response.data._id;
            });
    };

    factory.populateSongs = function() {
        return $http.get('/api/songs/')
            .then(function(songs) {
                songs.data.forEach(function(song) {
                    song.voteValue = song.totalUpVotes - song.totalDownVotes;
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
                    song: song
                });
            })
            .then(null, console.error.bind(console));
    };

    factory.sort = function() {
        playlist.sort(function(a, b) {
            return b.voteValue - a.voteValue;
        });
    };

    factory.vote = function($event, song, vote, user, room) {
        console.log('Vote user', user)
        console.log('Vote room', room)
        $event.stopPropagation();
        // if (vote === 'up') {
        //     song.voteValue++;
        // } else song.voteValue--;
        SocketFactory.emitVote({song: song, vote: vote, user: user, room: room});
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

    factory.getAllSongs = function() {
        return $http.get('/api/songs');
    }

    socket.on('updateVotes', function(song) {
        // var song = songObj.song;
        var songToUpdate = _.find(playlist, function(o) {
                return o.title === song.title;
            })
            // if(songObj.voteType === 'up') {
            //       song.voteValue++;
            //    }
            //    else song.voteValue--;
            //Set playlist song to updated song
        playlist[playlist.indexOf(songToUpdate)] = song;
        $rootScope.$digest();
    })

    return factory;
})
