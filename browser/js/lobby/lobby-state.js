app.config(function($stateProvider) {
    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html',
        controller: 'LobbyCtrl',
        resolve: {
        	user: function (AuthService) {
        		return AuthService.getLoggedInUser()
        				.then((user)=>{
        					return user;
        				})
        	}
        }
    })
}).controller('LobbyCtrl', ($scope, user) => {
    $scope.user = user;
    console.log('does this even work');
})


