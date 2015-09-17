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
        fluidClass: 'imgix-fluid',
        updateOnResizeDown: true,
        updateOnPinchZoom: true,
        pixelStep: 10,
      });
      var bgOptions = {
        fluidClass: 'imgix-fluid-bg',
        updateOnResizeDown: true,
        updateOnPinchZoom: true,
        pixelStep: 10,
      };
      imgix.fluid(bgOptions);
    };
  }
})();
