app.factory('PlaylistFactory', function($http, $rootScope, SocketFactory) {
    var factory = {};
    var playlist;
    var currentSong;
    var upvoteAmount = 1;
    var downvoteAmount = -1;
    var socket = SocketFactory.getSocket();

    

    //Called when new room is created
    factory.createPlaylist = function() {
        return $http.post('/api/playlists', {})
            .then(function(response) {
                playlist = response.data;
                return response.data._id;
            });
    };

    //Returns the playlist for specific room
    factory.getRoomPlaylist = () => {
        return $http({
            method: 'GET',
            url: '/api/playlists/' + playlist._id
        })
        .then(response => {
            playlist =response.data
        });
    }

    //Returns song from DB or null if song doesn't exist
    var _findSongAndReturn = function(song) {
        var youtubeId = song.id.videoId;
        return $http.get('/api/songs/yid/' + youtubeId)
            .then(function(song) {
                return song.data;
            });
    };

    //Creates new song in database
    var _addSongToDb = function(song) {
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

    //Adding new songs to room playlist
    factory.addSong = function(song, user) {
        return _findSongAndReturn(song)
            .then(function(songFromDb) {
                if (!songFromDb) {
                    return _addSongToDb(song);
                }
                return songFromDb;
            })
            .then(function(song) {
                return $http.put('/api/playlists/' + playlist._id, {
                    song: song,
                    user: user._id
                });
            })
            .then(null, console.error.bind(console));
    };

    //Sorts playlist by vote value
    factory.sort = function() {
        if (playlist) {
                playlist.songs.sort(function(a, b) {
                return b.total - a.total;
            });
        }
    };

    factory.vote = function($event, song, vote, user, room) {
        $event.stopPropagation();
        SocketFactory.emitVote({song: song, vote: vote, user: user, room: room});
        if(vote.type === 'up') {
            $rootScope.$emit('upvote');
        }
        else {
            $rootScope.$emit('downvote');
        }
    };

    factory.setPlaylist = function(newPlaylist) {
        playlist = newPlaylist;
        factory.sort();
    };

    factory.getPlaylist = function() {
        return playlist;
    };

    factory.setCurrentSong = function(newSong) {

        currentSong = newSong;
    };

    factory.getCurrentSong = function() {
        if(!currentSong) return null;
        console.log("CURRENT SONG", currentSong)
        return currentSong;
    };

    factory.getUpvoteAmount = () => {
        return upvoteAmount;
    };

    factory.setUpvoteAmount = (num) => {
        upvoteAmount = num;
    };

    factory.getDownvoteAmount = () => {
        return downvoteAmount;
    };

    factory.setDownvoteAmount = (num) => {
        downvoteAmount = num;
    };

    factory.checkIfUserVoted = (user, song) => {
        if (song.downVotes.indexOf(user._id) > -1) return true;
        else if (song.upVotes.indexOf(user._id) > -1) return true;
        return false;
    }

    socket.on('updateVotes', function(updatedObj) {
        var songToUpdate = _.find(playlist.songs, function(o) {
                return o.song.title === updatedObj.updatedSong.song.title;
            })
        var updateIndex = playlist.songs.indexOf(songToUpdate)
        playlist.songs[updateIndex] = updatedObj.updatedSong;
        factory.sort();
        $rootScope.$digest();
    })

    socket.on('updateRoom', updateObj=> {
        playlist = updateObj.playlist;
        factory.sort();
        $rootScope.$digest();
    })

    return factory;
});
