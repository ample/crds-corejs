require('../services/password_service');

(function() {
    'use strict';

    module.exports = PasswordController;

    PasswordController.$inject = [
        '$scope',
        '$rootScope',
        '$log',
        '$state',
        'PasswordService'];

    function PasswordController(
        $scope,
        $rootScope,
        $log,
        $state,
        PasswordService) {

        $log.debug('Inside Password Controller');

        var vm = this;
        vm.saving = false;

        vm.resetRequest = function(form) {
            vm.saving = true;
            var email = { 'email' : vm.emailAddress }
            PasswordService.ResetRequest.save(email).$promise.then(function (response) {

                $rootScope.$emit('notify', $rootScope.MESSAGES.resetRequestSuccess);
                debugger;
                vm.saving = false;
                $state.go('content', {link: '/'});
            }, function (error) {
                $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
                debugger;
                vm.saving = false;
            });
        }
    };
})();
