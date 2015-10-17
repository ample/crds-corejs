(function() {
  'use strict';

  module.exports = ProfilePictureViewController;

  ProfilePictureViewController.$inject = ['ImageService', '$cookies'];

  function ProfilePictureViewController(ImageService, $cookies) {
    var vm = this;
    if (!vm.contactId) {
      vm.contactId = $cookies.get('userId');
    }

    vm.path = ImageService.ProfileImageBaseURL + vm.contactId;
    vm.defaultImage = ImageService.DefaultProfileImage;
  }

})();
