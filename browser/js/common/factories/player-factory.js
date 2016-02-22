app.factory('PlayerFactory', (PlaylistFactory, $http) => {
    let youtubePlayer;
    let factory = {};

    factory.startPlaylist = () => {
        let playlist = PlaylistFactory.getPlaylist().songs;
        factory.loadVideoById(playlist[0]);
        // playlist.shift();
    }

    factory.loadVideoById = songObj => {
        let songID = songObj.song.youTubeId;
        PlaylistFactory.setCurrentSong(songObj);
        let playlistObj = PlaylistFactory.getPlaylist();
        let playlist = playlistObj.songs;
        let index = playlist.indexOf(songObj);
        playlist.splice(index, 1);
        youtubePlayer.loadVideoById(songID);
        return $http({
            method: 'DELETE',
            url: `/api/playlists/${playlistObj._id}/${songObj._id}`
        })
    };

    factory.playNextSong = currentSong => {
        factory.loadVideoById(PlaylistFactory.getPlaylist().songs[0]);
    };

    factory.getPlayer = () => youtubePlayer;

    factory.setPlayer = newPlayer => {
        youtubePlayer = newPlayer;
    };

    factory.destroy = () => {
        youtubePlayer.destroy();
    };

    return factory;

});
