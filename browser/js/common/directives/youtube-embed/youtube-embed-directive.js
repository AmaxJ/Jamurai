app.directive('youtubeEmbed', function($window, PlayerFactory, PlaylistFactory, SocketFactory, PowerupFactory, $rootScope) {
    return {
        restrict: "E",

        scope: {
            height: "@",
            width: "@",
            videoid: "@"
        },

        templateUrl: 'js/common/directives/youtube-embed/youtube-embed.html',

        link: function(scope, element) {

            var youtubePlayer = PlayerFactory.getPlayer();
            var socket = SocketFactory.getSocket();
            //Loads player and attaches to DOM
            function stateChange(event) {
              if(event.data === 0) {
                var currentSong = PlaylistFactory.getCurrentSong();
                PlayerFactory.playNextSong(currentSong);
              };
              if(event.data === 1){
                var currentSong = PlaylistFactory.getCurrentSong();
                var playlistId = currentSong.playlist;
                var userToPowerUp = currentSong.submittedBy._id;
                PowerupFactory.addPowerup(playlistId, userToPowerUp)

              }
            }


            var tag = document.createElement('script');
            tag.src = "http://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


            $window.onYouTubeIframeAPIReady = function() {
                PlayerFactory.setPlayer(new YT.Player('player', {
                    height: scope.height,
                    width: scope.width,
                    videoId: scope.videoid,
                    playerVars: {'disablekd': 0, 'fs': 1},
                    events: {
                        'onStateChange': stateChange
                    }
                }));
            };

            $window.onYouTubeIframeAPIReady();
        },
    }
});
