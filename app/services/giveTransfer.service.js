(function() {

  module.exports = GiveTransferService;

  angular.module('crossroads.core').factory('GiveTransferService', GiveTransferService);

  function GiveTransferService() {
    var transferObject = {
      reset: function() {
        this.account = '';
        this.amount = '';
        this.ccNumberClass = '';
        this.changeAccountInfo = false;
        this.declinedPayment = false;
        this.donor = '';
        this.email = '';
        this.program = '';
        this.routing = '';
        this.savedPayment = '';
        this.view = '';
      }
    };
    transferObject.reset();

    return transferObject;
  }
})();
