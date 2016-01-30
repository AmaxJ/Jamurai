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
    $scope.isEditable = ProfileFactory.getIsEditable;
    $scope.setEditable = ProfileFactory.setIsEditable;
    $scope.updateDetails = {};
})

.factory('ProfileFactory', function($http){
    var factory = {};
    var isEditable = false;

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

    factory.getIsEditable = () => {
        return isEditable;
    }

    factory.setIsEditable = () => {
        isEditable = !isEditable;
    }

    return factory;
})