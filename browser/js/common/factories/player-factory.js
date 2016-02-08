app.factory('PlayerFactory', (PlaylistFactory) => {
    var youtubePlayer;
    var factory = {};

    factory.startPlaylist = () => {
        console.log('FIRST SONG',PlaylistFactory.getPlaylist().songs[0])
        var playlist = PlaylistFactory.getPlaylist().songs;
        factory.loadVideoById(playlist[0]);
        playlist.shift();

    }

    factory.loadVideoById = (songObj) => {
        var songID = songObj.song.youTubeId;
        PlaylistFactory.setCurrentSong(songObj);
        youtubePlayer.loadVideoById(songID);
    };

    factory.playNextSong = (currentSong) => {
        var currentSongIndex = PlaylistFactory.getPlaylist().indexOf(currentSong);
        var nextSongId = PlaylistFactory.getPlaylist()[currentSongIndex + 1];
        factory.loadVideoById(nextSongId);
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
