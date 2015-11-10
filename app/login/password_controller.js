require('../services/password_service');

(function() {
    'use strict';

    module.exports = PasswordController;

    PasswordController.$inject = [
        '$scope',
        '$log',
        '$state',
        'PasswordService'];

    function PasswordController(
        $scope,
        $log,
        $state,
        PasswordService) {

        $log.debug('Inside Password Controller');
        var vm = this;
        vm.saving = false;

        $scope.emailAddress = "Email";

        $scope.resetRequest = function(form) {
            var email = { 'email' : $scope.emailAddress }
            PasswordService.ResetRequest.save(email).$promise.then(function (response) {

                //$rootScope.$emit('notify', $rootScope.MESSAGES.corkboardPostSuccess);
                debugger;
                vm.saving = false;
                route = '';
                $state.go('content', {link: '/'})
            }, function (error) {
                //$rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
                debugger;
                vm.saving = false;
            });
        }
    };
})();
