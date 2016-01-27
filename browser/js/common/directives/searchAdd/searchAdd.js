app.directive('searchAdd', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/searchAdd/searchAdd.html',
        link: function (scope) {
            scope.search = function(text) {
                console.log(text);
            }
            scope.entry = "A-team";
            scope.add = function(entry) {
                console.log(entry)
            }
           

        }

    };

});