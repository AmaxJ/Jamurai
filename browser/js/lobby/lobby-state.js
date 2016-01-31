app.config(function($stateProvider) {
    $stateProvider.state('lobby', {
        url: '/lobby',
        templateUrl: 'js/lobby/lobby.html',
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
    console.log(user);
})


