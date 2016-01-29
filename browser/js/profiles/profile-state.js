app.config(function($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'js/profiles/profile-template.html',
        controller: 'ProfileCtrl',
        resolve: {
        	theUser: function (AuthService) {
        		return AuthService.getLoggedInUser()
                .then(function(user){
                    console.log('Logged in?',user)
                    return user;
                })
        	}
        }
    });
})

.controller('ProfileCtrl', function($scope, ProfileFactory, theUser){
    $scope.updateUser = ProfileFactory.updateUser;
    $scope.loggedInUser = theUser;
})

.factory('ProfileFactory', function($http){
    var factory = {};

    factory.updateUser = (user, update) => {
        console.log('Hello from profile factory')
        console.log('USER', user._id);
        console.log('UPDATE', update);
        $http({
            method: 'PUT',
            url: 'api/users/' + user._id,
            data: update
        })
        .then(function(response){
            console.log('Updated user?',response.data);
        })
    }

    return factory;
})