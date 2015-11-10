(function() {
    'use strict';

    module.exports = PasswordService;

    PasswordService.$inject = ['$resource'];

    // Search: $resource(__API_ENDPOINT__ + 'api/trip/search'),

    function PasswordService($resource) {
        return {
            ResetRequest: $resource(__API_ENDPOINT__ + 'api/resetpasswordrequest')
       };
    }
})();
