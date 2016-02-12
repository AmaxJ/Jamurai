app.directive('youtubeEmbed', ($window, PlayerFactory, PlaylistFactory, SocketFactory, PowerupFactory, $rootScope) => {
    return {
        restrict: "E",

        scope: {
            height: "@",
            width: "@",
            videoid: "@"
        },

        templateUrl: 'js/common/directives/youtube-embed/youtube-embed.html',

        link: (scope, element) => {

            let youtubePlayer = PlayerFactory.getPlayer();
            let socket = SocketFactory.getSocket();
            //Loads player and attaches to DOM
            function stateChange(event) {
              if(event.data === 0) {
                let currentSong = PlaylistFactory.getCurrentSong();
                PlayerFactory.playNextSong(currentSong);
              };
              if(event.data === 1){
                let currentSong = PlaylistFactory.getCurrentSong();
                let playlistId = currentSong.playlist;
                let userToPowerUp = currentSong.submittedBy._id;
                PowerupFactory.addPowerup(playlistId, userToPowerUp)

              }
            }


            let tag = document.createElement('script');
            tag.src = "http://www.youtube.com/iframe_api";
            let firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


            $window.onYouTubeIframeAPIReady = function() {
                PlayerFactory.setPlayer(new YT.Player('player', {
                    height: scope.height,
                    width: scope.width,
                    videoId: scope.videoid,
                    playerVars: {'controls': 0, 'disablekd': 0, 'fs': 1},
                    events: {
                        'onReady': '',
                        'onStateChange': stateChange
                    }
                }));
            };

            $window.onYouTubeIframeAPIReady();
        },
    }
});
