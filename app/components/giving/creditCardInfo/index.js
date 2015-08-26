(function() {
  'use strict';
    
  require('./creditCardInfo.html');

  angular.module('crossroads.core').directive('creditCardInfo', require('./creditCardInfo.directive'));
  
})();;
