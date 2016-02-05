'use strict';

app.directive('oauth', () => {
  return {
    scope: {
      serviceProvider: '@',
      image: '@'
    },
    restrict: 'E',
    templateUrl: 'js/common/directives/navbar/oauth/oauth.html'
  }
});
