(function () {
  'use strict';
  angular.module('crossroads.core').service('Session', SessionService);

  SessionService.$inject = ['$log','$cookies', '$http'];

  function SessionService($log, $cookies, $http) {
    var vm = this;

    vm.create = function(sessionId, userTokenExp, userId, username) {
      console.log('creating cookies!');
      var expDate = new Date();
      expDate.setTime(expDate.getTime() + (userTokenExp * 1000));
      $cookies.put('sessionId', sessionId, {
        expires: expDate
      });
      $cookies.put('userId', userId);
      $cookies.put('username', username);
      $http.defaults.headers.common.Authorization = sessionId;
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
      $cookies.remove('userId');
      $cookies.remove('username');
      $cookies.remove('family');
      $cookies.remove('age');
      $http.defaults.headers.common.Authorization = undefined;
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

})();
