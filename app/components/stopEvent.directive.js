(function() {
  'use strict';
  angular.module('crossroads.core').directive('stopEvent', function () {
    return {
      restrict: 'A',
      // TODO: See if this is still needed after moving from angular-touch to fastclick
      // TODO: See this post https://github.com/angular-ui/bootstrap/issues/2017

      link: function (scope, element, attr) {
        element.on(attr.stopEvent, function (e) {
          e.stopPropagation();
          element.focus();
        });
      }
    };
  });
})();
