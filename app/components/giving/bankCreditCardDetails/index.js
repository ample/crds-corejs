(function() {
  'use strict';

  require('./bankCreditCardDetails.html');
  angular.module('crossroads.core').directive('bankCreditCardDetails', require('./bankCreditCardDetails.directive'));

})();
