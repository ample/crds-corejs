(function() {
  'use strict';

  angular.module('crossroads.core').service('Session', SessionService);

  var timeoutPromise;

  SessionService.$inject = [
    '$log',
    '$http',
    '$state',
    '$timeout',
    '$cookies',
    '$modal',
    '$injector'];

  function SessionService(
    $log,
    $http,
    $state,
    $timeout,
    $cookies,
    $modal,
    $injector
  ) {
    var vm = this;

    vm.create = function(refreshToken, sessionId, userTokenExp, userId, username) {
      console.log('creating cookies!');
      var expDate = new Date();
      expDate.setTime(expDate.getTime() + (userTokenExp * 1000));
      $cookies.put('sessionId', sessionId, {
        expires: expDate
      });
      $cookies.put('userId', userId);
      $cookies.put('username', username);
      $cookies.put('refreshToken', refreshToken, {
        expires: expDate
      });
      $http.defaults.headers.common.Authorization = sessionId;
      $http.defaults.headers.common.RefreshToken = refreshToken;
    };

    vm.refresh = function(response) {
      $http.defaults.headers.common.RefreshToken = response.headers('refreshToken');
      $http.defaults.headers.common.Authorization = response.headers('sessionId');

      console.log('updating cookies!');
      var expDate = new Date();
      var sessionLength = 1800000;
      expDate.setTime(expDate.getTime() + sessionLength);
      $timeout.cancel(timeoutPromise);
      timeoutPromise = $timeout(
        function() {
          openStayLoggedInModal($injector, $state, $modal, vm);
        },

        sessionLength);

      $cookies.put('sessionId', response.headers('sessionId'), {
        expires: expDate
      });
      $cookies.put('refreshToken', response.headers('refreshToken'), {
        expires: expDate
      });
    };

    /*
     * This formats the family as a comma seperated string before storing in the
     * cookie called 'family'
     *
     * @param family - an array of participant ids
     */
    vm.addFamilyMembers = function(family) {
      $log.debug('Adding ' + family + ' to family cookie');
      $cookies.put('family', family.join(','));
    };

    /*
     * @returns an array of participant ids
     */
    vm.getFamilyMembers = function() {
      if (this.exists('family')) {
        return _.map($cookies.get('family').split(','), function(strFam) {
          return Number(strFam);
        });
      }

      return [];
    };

    vm.isActive = function() {
      var ex = this.exists('sessionId');
      if (ex === undefined || ex === null) {
        return false;
      }

      return true;
    };

    vm.exists = function(cookieId) {
      return $cookies.get(cookieId);
    };

    vm.clear = function() {
      $cookies.remove('sessionId');
      $cookies.remove('refreshToken');
      $cookies.remove('userId');
      $cookies.remove('username');
      $cookies.remove('family');
      $cookies.remove('age');
      $http.defaults.headers.common.Authorization = undefined;
      $http.defaults.headers.common.RefreshToken = undefined;
      return true;
    };

    vm.getUserRole = function() {
      return '';
    };

    //TODO: Get this working to DRY up login_controller and register_controller
    vm.redirectIfNeeded = function($state) {

      if (vm.hasRedirectionInfo()) {
        var url = vm.exists('redirectUrl');
        var params = vm.exists('params');
        vm.removeRedirectRoute();
        if (params === undefined) {
          $state.go(url);
        } else {
          $state.go(url, JSON.parse(params));
        }
      }
    };

    vm.addRedirectRoute = function(redirectUrl, params) {
      $cookies.put('redirectUrl', redirectUrl);
      $cookies.put('params', JSON.stringify(params));
    };

    vm.removeRedirectRoute = function() {
      $cookies.remove('redirectUrl');
      $cookies.remove('params');
    };

    vm.hasRedirectionInfo = function() {
      if (this.exists('redirectUrl') !== undefined) {
        return true;
      }

      return false;
    };

    return this;
  }

  function openStayLoggedInModal($injector, $state, $modal, Session) {
    //Only open if on a protected page?
    if ($state.current.data.isProtected) {
      var AuthService = $injector.get('AuthService');
      var modal = $modal.open({
          templateUrl: 'stayLoggedInModal/stayLoggedInModal.html',
          controller: 'StayLoggedInController as StayLoggedIn',
          backdrop: 'static',
          keyboard: false,
          show: false,
        });

      modal.result.then(function(result) {
        //login success
      },

      function(result) {
        //TODO:Once we stop using rootScope we can remove this and the depenedency on Injector
        AuthService.logout();
        $state.go('content', {link: '/'});
      });
    }
  }

})();
