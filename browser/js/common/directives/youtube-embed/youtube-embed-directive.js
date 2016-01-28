app.directive('youtubeEmbed', function($window, PlayerFactory) {
    return {
        restrict: "E",

        scope: {
            height: "@",
            width: "@",
            videoid: "@"
        },

        template: '<div id="player"></div>',

        link: function(scope, element) {

            var youtubePlayer = PlayerFactory.getPlayer();

            //Loads player and attaches to DOM
            function stateChange(event) { 
              // if(event.data === 0) PlayerFactory.playNext();
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
                    events: {
                        'onReady': '',
                        'onStateChange': stateChange
                    }
                }));
            };
        },
    }
});
