app.directive('playerBar', function(PlayerFactory){
	return {
		restrict: "E",
		templateUrl: '/js/common/directives/player-bar/player-bar-template.html',
		link: function(s,e,a){
			var showVid = true;
			s.toggleVid = function(){
				showVid = !showVid;
			}
			s.getVidState = function(){
				return showVid;
			}
			s.play = PlayerFactory.play;
			s.pause = PlayerFactory.pause;
		}
	}
})

