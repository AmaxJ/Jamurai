app.config(function($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'js/profiles/profile-template.html',
        controller: 'ProfileCtrl',
        resolve: {
        	theUser: function (AuthService) {
        		return AuthService.getLoggedInUser()
                .then(function(user){
                    return user;
                })
        	}
        }
    });
})

.controller('ProfileCtrl', function($scope, ProfileFactory, theUser){
    var isEditable = false;
    $scope.loggedInUser = theUser;
    $scope.updateUser = function(user, update){
        ProfileFactory.updateUser(user, update)
        .then(function(user){
            $scope.updateDetails = {};
            ProfileFactory.setIsEditable();
            loggedInUser = user;
        })
    }
    // $scope.loggedInUser = ProfileFactory.getLoggedInUser;
    $scope.isEditable = () => {
        return isEditable;
    }
    $scope.setEditable = () => {
        isEditable = !isEditable;
    }
    $scope.updateDetails = {};
})

.factory('ProfileFactory', function($http){
    var factory = {};
    
    factory.updateUser = (user, update) => {
        return $http({
            method: 'PUT',
            url: 'api/users/' + user._id,
            data: update
        })
        .then(function(response){
            console.log('Updated user?',response.data);
            return response.data;
        })
    }


    return factory;
});