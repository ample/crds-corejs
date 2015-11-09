require('../services/password_service');

(function() {
    'use strict';

    module.exports = PasswordController;

    PasswordController.$inject = [
        '$scope',
        '$log',
        'PasswordService'];

    function PasswordController(
        $scope,
        $log,
        PasswordService) {

        $log.debug('Inside Password Controller');
        var vm = this;

        $scope.emailAddress = "Email";

        $scope.resetRequest = function(form) {

            if (form.$invalid) {
                $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
                vm.saving = false;
            }

            var email = { 'email' : $scope.emailAddress }

            debugger;
            PasswordService.ResetRequest.save(email);
        }
    };
})();
