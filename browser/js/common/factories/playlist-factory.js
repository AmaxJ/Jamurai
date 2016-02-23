app.factory('PlaylistFactory', ($http, $rootScope, SocketFactory) => {
    let factory = {};
    let playlist;
    let currentSong;
    let upvoteAmount = 1;
    let downvoteAmount = -1;
    let socket = SocketFactory.getSocket();

    //Called when new room is created
    factory.createPlaylist = () => {
        return $http.post('/api/playlists', {})
            .then(response => {
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
    let _findSongAndReturn = song => {
        let youtubeId = song.id.videoId;
        return $http.get(`/api/songs/yid/${youtubeId}`)
            .then(song => song.data);
    };

    //Creates new song in database
    let _addSongToDb = song => {
        let newSong = {
            title: song.snippet.title,
            youTubeId: song.id.videoId,
            youTubeChannel: song.snippet.channelTitle,
            publishedAt: song.snippet.publishedAt,
            thumbnails: song.snippet.thumbnails
        }
        return $http.post('/api/songs', newSong)
            .then(response => response.data);
    };

    //Adding new songs to room playlist
    factory.addSong = (song, user, roomId) => {
        return _findSongAndReturn(song)
            .then(songFromDb => {
                if (!songFromDb) {
                    return _addSongToDb(song);
                }
                return songFromDb;
            })
            .then(song => {
                return $http.put(`/api/playlists/${playlist._id}`, {
                    song: song,
                    user: user._id,
                    roomId: roomId
                });
            })
            .then(null, console.error.bind(console));
    };

    //Sorts playlist by vote value
    factory.sort = () => {
        if (playlist) {
                playlist.songs.sort((a, b) => {
                return b.total - a.total;
            });
        }
    };

    factory.vote = ($event, song, vote, user, room) => {
        $event.stopPropagation();
        SocketFactory.emitVote({song: song, vote: vote, user: user, room: room});
        if(vote.type === 'up') {
            $rootScope.$emit('upvote');
        }
        else {
            $rootScope.$emit('downvote');
        }
    };

    factory.setPlaylist = newPlaylist => {
        playlist = newPlaylist;
        factory.sort();
    };

    factory.getPlaylist = () => playlist;

    factory.setCurrentSong = newSong => {
        currentSong = newSong;
    };

    factory.getCurrentSong = () => {
        if(!currentSong) return null;
        return currentSong;
    };

    factory.getUpvoteAmount = () => upvoteAmount;

    factory.setUpvoteAmount = num => {
        upvoteAmount = num;
    };

    factory.getDownvoteAmount = () => downvoteAmount;

    factory.setDownvoteAmount = num => {
        downvoteAmount = num;
    };

    factory.checkUserVote = (user, song) => {
        if (song.upVotes.indexOf(user._id) > -1) return 'upVote';
        else if (song.downVotes.indexOf(user._id) > -1) return 'downVote';
    }


    socket.on('updateRoom', updateObj => {
        if(updateObj.playlist) {
            playlist = updateObj.playlist;
            factory.sort();
            $rootScope.$digest();
        }
    })

    return factory;
});
