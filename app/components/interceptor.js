(function() {
  'use strict';
  angular.module('crossroads.core').factory('InterceptorFactory', InterceptorFactory);

  InterceptorFactory.$inject = ['$injector', '$rootScope', '$timeout', '$cookies', 'AUTH_EVENTS'];

  var timeoutPromise;

  function InterceptorFactory($injector, $rootScope, $timeout, $cookies, AUTH_EVENTS) {
    return {
      request: function(config) {
        return config;
      },

      response: function(response) {
        if (response.headers('refreshToken')) {
          var $http = $injector.get('$http');
          $http.defaults.headers.common.RefreshToken = response.headers('refreshToken');
          $http.defaults.headers.common.Authorization = response.headers('sessionId');

          console.log('updating cookies!');
          var expDate = new Date();
          var sessionLength = 1800000;
          expDate.setTime(expDate.getTime() + sessionLength);
          $timeout.cancel(timeoutPromise);
          timeoutPromise = $timeout(function() {openStayLoggedInModal($injector);}, 3000);

          $cookies.put('sessionId', response.headers('sessionId'), {
            expires: expDate,
            path: '/'
          });
          $cookies.put('refreshToken', response.headers('refreshToken'), {
            expires: expDate,
            path: '/'
          });
        }

        return response;
      }
    };
  }

  function openStayLoggedInModal($injector) {
    var $modal = $injector.get('$modal');
    var modal = $modal.open({
        templateUrl: 'stayLoggedInModal/stayLoggedInModal.html',
        controller: 'StayLoggedInController as modal',
        backdrop: true,
        show: false,
      });

      //changeProfileImage.result.then(function(croppedImage)
  }

  var app = angular.module('crossroads.core');
  app.config(AppConfig);
  AppConfig.$inject = ['$httpProvider'];
  function AppConfig($httpProvider) {
    $httpProvider.interceptors.push('InterceptorFactory');
  }

})();
