(function() {
  require('./bankInfo.html');

  angular.module('crossroads.core').directive('bankInfo', require('./bankInfo.directive'));

})();
