(function() {
  'use strict';

  module.exports = ImageService;

  Image.$inject = ['$resource', '$cookies'];

  function ImageService($resource, $cookies) {
    return {
      Image: $resource(__API_ENDPOINT__ + 'api/image/:id'),
      ProfileImage: $resource(__API_ENDPOINT__ + 'api/image/profile/:id')
    };
  }
})();
