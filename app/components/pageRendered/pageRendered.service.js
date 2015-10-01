(function() {
  'use strict';

  module.exports = PageRenderedService;

  PageRenderedService.$inject = ['$timeout', '$window'];

  function PageRenderedService($timeout, $window) {
    return {
      pageLoaded: function() {
        $timeout(pageLoaded);
      }
    }

    function pageLoaded() {
      tellPrerenderIoPageIsReady();
      intializeAddThis();
    }

    function tellPrerenderIoPageIsReady() {
      $window.prerenderReady = true;
    }

    function intializeAddThis() {
      if (addthis) {
        addthis.init();
      }
    }
  }
})();
