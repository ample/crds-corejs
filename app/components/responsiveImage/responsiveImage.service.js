(function() {
  'use strict';

  module.exports = ResponsiveImageService;

  ResponsiveImageService.$inject = ['$timeout'];

  function ResponsiveImageService($timeout) {
    return {
      updateResponsiveImages: function() {
        $timeout(replaceImages);
      }
    }

    function replaceImages() {
      imgix.fluid({
        fluidClass: 'img-responsive',
        autoInsertCSSBestPractices: true
      });
    };
  }
})();
