'use strict()';
(function(){

  var app = angular.module('crossroads.core');
  app.config(AppConfig);

  AppConfig.$inject = [
    '$provide',
    '$httpProvider',
    '$locationProvider',
    'datepickerConfig',
    'datepickerPopupConfig',
    '$cookiesProvider'];

  function AppConfig($provide,
        $httpProvider,
        $locationProvider,
        datepickerConfig,
        datepickerPopupConfig,
        $cookiesProvider) {
    $provide.decorator('$state', function($delegate, $rootScope) {
      $rootScope.$on('$stateChangeStart', function(event, state, params) {
        $delegate.next = state;
        $delegate.toParams = params;
      });

      return $delegate;
    });

    $locationProvider.html5Mode({
      enabled:true,
      requireBase:false
    });

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common.Authorization = crds_utilities.getCookie('sessionId');
    $httpProvider.defaults.headers.common.RefreshToken = crds_utilities.getCookie('refreshToken');

    //TODO: Consider replacing this with a factory to better handle the hacky cookies injection below
    $httpProvider.interceptors.push(function() {
      return {
        request: function(config) {
          return config;
        },

        response: function(response) {
          if (response.headers('refreshToken')) {
            $httpProvider.defaults.headers.common.RefreshToken = response.headers('refreshToken');
            $httpProvider.defaults.headers.common.Authorization = response.headers('sessionId');
            var $cookies;
            angular.injector(['ngCookies']).invoke(['$cookies', function(_$cookies_) {
              $cookies = _$cookies_;
            }]);

            console.log('updating cookies!');
            var expDate = new Date();
            expDate.setTime(expDate.getTime() + (1800000));
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
    });

    // This is a dummy header that will always be returned
    // in any 'Allow-Header' from any CORS request
    //This needs to be here because of IE.
    $httpProvider.defaults.headers.common['X-Use-The-Force'] = true;

    configureDefaultCookieScope($cookiesProvider);
    configureDatePickersDefaults(datepickerConfig, datepickerPopupConfig);
  }

  var configureDefaultCookieScope =  function($cookiesProvider) {
    $cookiesProvider.defaults.path = '/';
  };

  var configureDatePickersDefaults = function(datepickerConfig, datepickerPopupConfig) {
    datepickerConfig.showWeeks = false;
    datepickerPopupConfig.showWeeks = false;
  };

})();
