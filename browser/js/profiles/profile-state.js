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
    var loggedInUser = theUser;
    $scope.loggedInUser = () => {
        return loggedInUser;
    }
    $scope.updateUser = function(user, update){
        ProfileFactory.updateUser(user, update)
        .then(function(user){
            $scope.updateDetails = {};
            ProfileFactory.setIsEditable();
            loggedInUser = user;
        })
    }
    // $scope.loggedInUser = ProfileFactory.getLoggedInUser;
    $scope.isEditable = ProfileFactory.getIsEditable;
    $scope.setEditable = ProfileFactory.setIsEditable;
    $scope.updateDetails = {};
})

.factory('ProfileFactory', function($http){
    var factory = {};
    var isEditable = false;
   

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

    factory.getIsEditable = () => {
        return isEditable;
    }

    factory.setIsEditable = () => {
        isEditable = !isEditable;
    }

    return factory;
})