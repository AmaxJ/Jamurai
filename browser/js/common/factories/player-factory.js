app.factory('PlayerFactory', (PlaylistFactory) => {
    var youtubePlayer;
    return {
            play() {
                youtubePlayer.playVideo();
            },

            pause() {
                youtubePlayer.pauseVideo();
            },

            stop() {
                youtubePlayer.stopVideo();
            },

            seekTo(seconds, seekAhead) {
                youtubePlayer.seekTo(seconds, seekAhead);
            },

            next() {
                youtubePlayer.nextVideo();
            },

            previous() {
                youtubePlayer.previousVideo();
            },

            mute() {
                youtubePlayer.mute();
            },

            unMute() {
                youtubePlayer.unMute();
            },

            isMuted() {
                youtubePlayer.isMuted();
            },

            setVolume(volume) {
                youtubePlayer.setVolume();
            },

            getVolume() {
                youtubePlayer.getVolume();
            },

            //Playback status:

            getVideoLoadedFraction() {
                youtubePlayer.getVideoLoadedFraction();
            },

            getPlayerState() {
                youtubePlayer.getPlayerState();
            },

            loadVideoById (song) {
                var songID = song.youTubeId;
                youtubePlayer.loadVideoById(songID);
                PlaylistFactory.setCurrentSong(song);
            },
            getPlayer() {
                return youtubePlayer;
            },
            setPlayer(newPlayer){
                youtubePlayer = newPlayer;
            }

    }

})
