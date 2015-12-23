require('../services/password_service');
require('../services/auth_service');

(function() {
  'use strict';

  module.exports = ResetPasswordController;

  ResetPasswordController.$inject = [
      '$rootScope',
      '$stateParams',
      '$log',
      '$state',
      'PasswordService',
      'TokenStatus'
  ];

  function ResetPasswordController(
      $rootScope,
      $stateParams,
      $log,
      $state,
      PasswordService,
      TokenStatus) {

    $log.debug('Inside Password Controller');

    var vm = this;
    vm.saving = false;
    vm.password = '';
    vm.resetToken = $stateParams.token;
    vm.pwprocessing = pwProcess;
    vm.submitPasswordReset = submitPasswordReset;
    vm.TokenStatus = TokenStatus;

    activate();

    function activate() {

      vm.TokenStatus.$promise.then(function(resolve) {

        var valueItem = resolve.TokenValid;

        if (valueItem === false) {
          $rootScope.$emit('notify', $rootScope.MESSAGES.invalidPasswordResetKey);

          setTimeout(function() { $state.go('content', {link: '/'}); }, 1000);
          //$state.go('content', {link: '/'}); // redirect to home if invalid link
        }
      }), function(err) {
        $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
      };

    };

    function submitPasswordReset() {

      if (vm.resetPasswordForm.$valid) {
        vm.saving = true;

        var reset = { password: vm.password, token: $stateParams.token };

        PasswordService.ResetPassword.save(reset).$promise.then(function(response) {
          $rootScope.$emit('notify', $rootScope.MESSAGES.resetRequestSuccess);
          $state.go('login');
        }, function(error) {

          $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
          vm.saving = false;
        });
      } else {
        vm.saving = false;
      }
    }

    function pwProcess() {
      if ($scope.pwprocessing == 'SHOW') {
        $scope.pwprocessing = 'HIDE';
        $scope.inputType = 'text';
      }      else {
        $scope.pwprocessing = 'SHOW';
        $scope.inputType = 'password';
      }
    };
  }
})();
