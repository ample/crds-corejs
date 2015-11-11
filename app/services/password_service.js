(function() {
    'use strict';

    module.exports = PasswordService;

    PasswordService.$inject = ['$resource'];

    function PasswordService($resource) {
        return {
            ResetRequest: $resource(__API_ENDPOINT__ + 'api/resetpasswordrequest'),
            EmailExists: $resource(__API_ENDPOINT__ + 'api/lookup/0/find/')
       };
    }

})();
