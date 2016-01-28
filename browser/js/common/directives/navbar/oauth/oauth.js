'use strict';

app.directive('oauth', () => {
  return {
    scope: {
      serviceProvider: '@'
    },
    restrict: 'E',
    templateUrl: 'js/common/directives/navbar/oauth/oauth.html'
  }
});
