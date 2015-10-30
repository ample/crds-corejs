(function() {
  'use strict';

  module.exports = ImageService;

  Image.$inject = ['$resource', '$cookies'];

  function ImageService($resource, $cookies) {
    return {
      Image: $resource(__API_ENDPOINT__ + 'api/image/:id'),
      ProfileImage: $resource(__API_ENDPOINT__ + 'api/image/profile/:id'),
      ProfileImageBaseURL: __API_ENDPOINT__ + 'api/image/profile/',
      ImageBaseURL: __API_ENDPOINT__ + 'api/image/',
      DefaultProfileImage: '//crossroads-media.imgix.net/images/avatar.svg'
    };
  }
})();
