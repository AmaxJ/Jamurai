app.directive('playerBar', function(){
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

		}
	}
})

