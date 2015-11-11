require('../services/password_service');

(function() {
    'use strict';

    module.exports = PasswordController;

    PasswordController.$inject = [
        '$rootScope',
        '$log',
        '$state',
        'PasswordService'];

    function PasswordController(
        $rootScope,
        $log,
        $state,
        PasswordService) {

        $log.debug('Inside Password Controller');

        var vm = this;
        vm.saving = false;

        vm.resetRequest = function(form) {

            vm.saving = true;

            if (form.forgotpasswordform.$valid) {

                var encodedEmail = encodeURI(vm.emailAddress).replace(/\+/g, '%2B');
                debugger;

                // don't send reset request if the email doesn't exist -- this is a little backwards
                // because we're using an existing api call
                PasswordService.EmailExists.get({ email: vm.emailAddress }, function (response) {
                    $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
                    vm.saving = false;
                }, function (error) {
                    var email = { 'email' : vm.emailAddress }
                    PasswordService.ResetRequest.save(email).$promise.then(function (response) {
                        $rootScope.$emit('notify', $rootScope.MESSAGES.resetRequestSuccess);
                        $state.go('content', {link: '/'});
                    }, function (error) {
                        $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
                        vm.saving = false;
                    });
                });
            }
        }

    };
})();
