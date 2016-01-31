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
})

// app.controller('LobbyCtrl', ($scope) => {
    
// })
