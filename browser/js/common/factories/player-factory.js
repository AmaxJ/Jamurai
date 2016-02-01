app.factory('PlayerFactory', (PlaylistFactory) => {
    var youtubePlayer;
    var factory = {};
    factory.play = () => {
        youtubePlayer.playVideo();
    }

    factory.pause = () => {
        youtubePlayer.pauseVideo();
    }

    factory.stop = () => {
        youtubePlayer.stopVideo();
    }

    factory.seekTo = (seconds, seekAhead) => {
        youtubePlayer.seekTo(seconds, seekAhead);
    }

    factory.next = () => {
        youtubePlayer.nextVideo();
    }

    factory.previous = () => {
        youtubePlayer.previousVideo();
    }

    factory.mute = () => {
        youtubePlayer.mute();
    }

    factory.unMute = () => {
        youtubePlayer.unMute();
    }

    factory.isMuted = () => {
        youtubePlayer.isMuted();
    }

    factory.setVolume = (volume) => {
        youtubePlayer.setVolume(volume);
    }

    factory.getVolume = () => {
        youtubePlayer.getVolume();
    }

    factory.getVideoLoadedFraction = () => {
        youtubePlayer.getVideoLoadedFraction();
    }

    factory.getPlayerState = () => {
        youtubePlayer.getPlayerState();
    }

    factory.loadVideoById = (song) => {
        var songID = song.youTubeId;
        youtubePlayer.loadVideoById(songID);
        PlaylistFactory.setCurrentSong(song);
    }

    factory.playNextSong = (currentSong) => {
        var currentSongIndex = PlaylistFactory.getPlaylist().indexOf(currentSong);
        var nextSongId = PlaylistFactory.getPlaylist()[currentSongIndex + 1];
        factory.loadVideoById(nextSongId);
    }

    factory.getPlayer = () => {
        return youtubePlayer;
    }

    factory.setPlayer = (newPlayer) => {
        youtubePlayer = newPlayer;
    }
    factory.destroy = () => {
        youtubePlayer.destroy();
    }

    return factory;

})
