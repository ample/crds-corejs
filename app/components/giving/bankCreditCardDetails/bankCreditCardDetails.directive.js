(function() {
  'use strict'; 

  module.exports = bankCreditCardDetails;

  bankCreditCardDetails.$inject = ['$log'];

  function bankCreditCardDetails($log) {
    var directive = {
      replace: true,
      restrict: 'EA',
      templateUrl: 'bankCreditCardDetails/bankCreditCardDetails.html',
      scope: {
        dto: '=',
        bankInfoSubmitted: '=',
        showCheckClass: '=',
        showMessage: '=',
        showMessageOnChange: '=',
        donor: '=',
        email: '=',
        setValidCard: '=',
        setValidCvc: '='
      },
      link: link,
    };
    return directive;

    function link(scope, element, attrs) {

      scope.togglePaymentInfo = togglePaymentInfo;

      ////////////////////////////////
      //// IMPLEMENTATION DETAILS ////
      ////////////////////////////////

      function togglePaymentInfo() {
        $timeout(function() {
          var e = vm.dto.view == 'cc' ?
            document.querySelector("[name='ccNumber']") : document.querySelector("[name='routing']");
          e.focus();
        }, 0);
      }

    }
  }
})();
