app.config(function($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'js/profiles/profile-template.html',
        controller: 'ProfileCtrl',
        resolve: {
        	theUser: (AuthService) => {
        		return AuthService.getLoggedInUser()
                .then(user => {
                    return user;
                })
        	},
            userPowerups: (theUser, UserFactory) => {
                let powerUpIcons = {
                    'Chopsticks of Plenty': '/food.svg',
                    'Sword of Ultimate Shame': '/twoswords.svg',
                    'Daggers of Disdain': '/daggerSolid.svg',
                    'Katana of Disgrace': '/sword.svg',
                    'Enlightened Blessing': '/discipline.svg',
                    'Sword of Uncertainty': '/yinyang.svg',
                    'Poison Darts': '/darts.svg',
                    'The Last Jamurai': '/helmet.svg'
                };

                let formatPowerUps = powerUpObj => {
                    return powerUpObj.map(powerup => {
                        let pwrUp = {};
                        pwrUp.name = powerup;
                        pwrUp.icon = powerUpIcons[powerup];
                        return pwrUp;
                    });
                };

                return UserFactory.getPowerupsByUser(theUser._id)
                .then(powerups => {
                    if (powerups.length > 0) {
                        return formatPowerUps(powerups);
                    }
                    else {
                        return [];
                    }
                })
            } 
        }
    });
})

.controller('ProfileCtrl', function($scope, ProfileFactory, theUser, userPowerups){
    var isEditable = false;
    $scope.userPowerups = userPowerups;
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
            return response.data;
        })
    }


    return factory;
});