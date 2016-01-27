//Adapted from http://blog.oxrud.com/posts/creating-youtube-directive/
var youtubePlayer;
app.directive('youtubeEmbed', function($window) {
    return {
        restrict: "E",

        scope: {
            height: "@",
            width: "@",
            videoid: "@"
        },

        template: '<div id="player"></div>',

        link: function(scope, element) {

            //Loads player and attaches to DOM
            function stateChange(event) { 
              // if(event.data === 0) PlayerFactory.playNext();
            }

            var tag = document.createElement('script');
            tag.src = "http://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


            $window.onYouTubeIframeAPIReady = function() {
                youtubePlayer = new YT.Player('player', {
                    height: scope.height,
                    width: scope.width,
                    videoId: scope.videoid,
                    events: {
                        'onReady': '',
                        'onStateChange': stateChange
                    }
                });
            };
        },
    }
});
