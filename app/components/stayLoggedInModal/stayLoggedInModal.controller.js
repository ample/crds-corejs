(function() {
  'use strict';
  module.exports = StayLoggedInCtrl;
  StayLoggedInCtrl.$inject = ['$modalInstance', '$scope', '$timeout'];
  function StayLoggedInCtrl($modalInstance, $scope, $timeout) {
    var vm = this;

    vm.ok = ok;
    vm.cancel = cancel;
    vm.modal = $modalInstance;

    function ok() {
      $modalInstance.close();
    }

    function cancel() {
      $modalInstance.dismiss('cancel');
    }
  }
})();
