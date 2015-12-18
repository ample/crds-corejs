(function() {

  'use strict';

  module.exports = PasswordField;

  PasswordField.$inject = ['$log', '$location', 'zxcvbn'];

  function PasswordField($log, $location, zxcvbn) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        passwd: '=',
        submitted: '=',
        prefix: '=',
        required: '@',
        passwdStrength: '@',
        minLength: '@'
      },
      templateUrl: 'passwordField/passwordField.html',
      controller: PasswordFieldController,
      controllerAs: 'passwd',
      bindToController: true
    };

    function PasswordFieldController() {
      var vm = this;

      vm.inputType = 'password';
      vm.pwChanged = pwChanged;
      vm.pwprocess = pwprocess;
      vm.pwprocessing = 'SHOW';
      vm.passwordInvalid = passwordInvalid;
      vm.passwordStrengthProgressClass = 'danger';
      vm.passwordStrengthProgressLabel = '';
      vm.showMeter = false;
      vm.isCollapsed = true;
      vm.passwd = '';

      activate();

      ////////////////////////

      function activate() {
        if (vm.passwdStrength === 'true') {
          vm.showMeter = true;
        }
      }

      function passwordInvalid() {
        //TODO Once global validation logic method has been created, use that shorter method here
        return vm.passwordForm.password.$error.required && vm.submitted &&
            vm.passwordForm.password.$dirty ||
            vm.passwordForm.password.$error.required && vm.submitted &&
            !vm.passwordForm.password.$touched ||
            vm.passwordForm.password.$error.required && vm.submitted &&
            vm.passwordForm.password.$touched ||
            !vm.passwordForm.password.$error.required &&
            vm.passwordForm.password.$dirty &&
            !vm.passwordForm.password.$valid;
      }

      function pwChanged() {

        vm.passwordStrength = zxcvbn(vm.passwd);
        vm.passwordStrengthProgress = (vm.passwordStrength.score / 4) * 100;

        switch (vm.passwordStrength.score) {
          case 1:
            vm.passwordStrengthProgressClass = 'danger';
            vm.passwordStrengthProgressLabel = 'Weak';
            break;
          case 2:
            vm.passwordStrengthProgressClass = 'warning';
            vm.passwordStrengthProgressLabel = 'Fair';
            break;
          case 3:
            vm.passwordStrengthProgressClass = 'success';
            vm.passwordStrengthProgressLabel = 'Good';
            break;
          case 4:
            vm.passwordStrengthProgressClass = 'success';
            vm.passwordStrengthProgressLabel = 'Great!';
            break;
          default:
            vm.passwordStrengthProgressClass = 'danger';
            vm.passwordStrengthProgressLabel = 'Weak';
        }

      }

      function pwprocess() {
        if (vm.pwprocessing === 'SHOW') {
          vm.pwprocessing = 'HIDE';
          vm.inputType = 'text';
        } else {
          vm.pwprocessing = 'SHOW';
          vm.inputType = 'password';
        }

        $log.debug(vm.pwprocessing);
      }

    }

  }
})();
