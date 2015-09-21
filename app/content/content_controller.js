'use strict';
module.exports = function($rootScope, $scope, $state, $stateParams, $log, ContentPageService, $sce) {
  $scope.main = 'ContentCtrl';
  $scope.params = $stateParams;
  $scope.page = $sce.trustAsHtml(ContentPageService.page.content);

  
};
