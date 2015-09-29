(function() {
  'use strict';

  module.exports = EmailBoxController;

  EmailBoxController.$inject = [];

  /**
   * Variables available on scope because they
   * have been passed into the directive:
   *   - isMessageToggled = boolean
   *   - sendMessageCallback = function to handle sending the message
   */
  function EmailBoxController() {
    var vm = this;
    vm.messageText = '';
    vm.sendMessage = sendMessage;

    activate();

    ////////////////////////////
    // IMPLEMENTATION DETAILS //
    ////////////////////////////

    function activate() {
      if (vm.isMessageToggled === undefined) {
        vm.isMessageToggled = false;
      }
    }

    function sendMessage() {
      var message = vm.messageText;
      vm.sendMessageCallback({message: vm.messageText});
    }
  }

})();
