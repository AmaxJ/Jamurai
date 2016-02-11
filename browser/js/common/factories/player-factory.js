app.factory('PlayerFactory', (PlaylistFactory, $http) => {
    var youtubePlayer;
    var factory = {};

    factory.startPlaylist = () => {
        var playlist = PlaylistFactory.getPlaylist().songs;
        factory.loadVideoById(playlist[0]);
        // playlist.shift();

    }

    factory.loadVideoById = (songObj) => {
        var songID = songObj.song.youTubeId;
        PlaylistFactory.setCurrentSong(songObj);
        var playlistObj = PlaylistFactory.getPlaylist();
        var playlist = playlistObj.songs;
        var index = playlist.indexOf(songObj);
        playlist.splice(index, 1);
        youtubePlayer.loadVideoById(songID);
        return $http({
            method: 'DELETE',
            url: '/api/playlists/' + playlistObj._id + '/' + songObj._id
        })
    };

    factory.playNextSong = (currentSong) => {
        // var currentSongIndex = PlaylistFactory.getPlaylist().songs.indexOf(currentSong);
        // var nextSongId = PlaylistFactory.getPlaylist()[currentSongIndex + 1];
        factory.loadVideoById(PlaylistFactory.getPlaylist().songs[0]);
    };

    factory.getPlayer = () => {
        return youtubePlayer;
    };

    factory.setPlayer = (newPlayer) => {
        youtubePlayer = newPlayer;
    };

    factory.destroy = () => {
        youtubePlayer.destroy();
    };

    return factory;

});
