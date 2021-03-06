(function() {
  'use strict';

  angular.module('crossroads.core').controller('coreController', CoreController);

  CoreController.$inject = [
    '$scope',
    '$rootScope',
    'MESSAGES',
    'ContentBlock',
    'growl',
    '$aside',
    'screenSize',
    '$state',
    'ResponsiveImageService',
    'PageRenderedService',
    '$modal',
    '$anchorScroll',
    '$window',
    '$location',
    'STATE_CHANGE_EVENTS',
  ];

  function CoreController(
    $scope,
    $rootScope,
    MESSAGES,
    ContentBlock,
    growl,
    $aside,
    screenSize,
    $state,
    ResponsiveImageService,
    PageRenderedService,
    $modal,
    $anchorScroll,
    $window,
    $location,
    STATE_CHANGE_EVENTS
  ) {

    var vm = this;

    vm.asideState = { open: false };
    vm.openAside = openAside;
    vm.prevent = prevent;
    vm.resolving = true;
    vm.state = $state;
    vm.mapContentBlocks = mapContentBlocks;
    vm.stayLoggedInPrompt = stayLoggedInPrompt;

    ////////////////////////////
    // State Change Listeners //
    ////////////////////////////
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if ((toState.resolve || toState.data.resolve) && !event.defaultPrevented) {
        vm.resolving = true;
      }

      if (fromState.name == 'explore') {
        $('#fullpage').hide();
        $.fn.fullpage.destroy('all');
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      ResponsiveImageService.updateResponsiveImages();
      PageRenderedService.pageLoaded();
      vm.resolving = false;
      $anchorScroll('top-header');
    });

    $rootScope.$on(STATE_CHANGE_EVENTS.clearResolving, function() {
      vm.resolving = false;
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      console.error('$stateChangeError: ' + error);
      console.error(error);

      //TODO: put the 'toState' in the session if we want to redirect to that page
      vm.resolving = false;
      $state.go('content', {link: '/server-error/'});
    });

    //////////////////////////
    /////// $ROOTSCOPE ///////
    //////////////////////////
    $rootScope.mobile = screenSize.on('xs, sm', function(match) { $rootScope.mobile = match; });

    $rootScope.$on('notify', function(event, msg, refId, ttl) {
      var parms = { };
      if (refId !== undefined && refId !== null) {
        parms.referenceId = refId;
      }

      if (ttl !== undefined && ttl !== null) {
        parms.ttl = ttl;
      }

      growl[msg.type](msg.content, parms);
    });

    $rootScope.$on('mailchimp-response', function(event, result, msg) {
      if (result === 'success') {
        $rootScope.$emit('notify', $rootScope.MESSAGES.mailchimpSuccess);
      } else if (result === 'error') {
        $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
      }
    });

    $rootScope.$on('context', function(event, id) {
      var contentBlocks = ContentBlock.get({
        id: id
      }, function() {
        return contentBlocks.ContentBlock.content;
      });
    });

    var contentBlockRequest = ContentBlock.get('', function() {
      mapContentBlocks(contentBlockRequest.contentBlocks);
    });

    function mapContentBlocks(contentBlocks) {
      _.reduce(contentBlocks, function(messages, cb) {
        messages[cb.title] = cb;
        return (messages);
      }, MESSAGES);
    }

    function openAside(position, backdrop) {
      vm.asideState = {
        open: true,
        position: position,
        animation: false
      };

      function postClose() {
        vm.asideState.open = false;
      }

      $aside.open({
        templateUrl: 'templates/nav-mobile.html',
        placement: position,
        size: 'sm',
        controller: function($scope, $modalInstance) {
          $scope.ok = function(e) {

            // This is a hack. It's a temporary fix to make external links work
            // in the mobile nav. Tate - 01/26/16

            if (e.target.host != location.host) {
              // External Link
              $window.location.href = e.target.href;
            } else {
              // Internal Link
              $location.path(e.target.pathname);
            }

            $modalInstance.close();
          };

          $scope.cancel = function(e) {
            $modalInstance.dismiss();
            e.stopPropagation();
          };
        }
      }).result.then(postClose, postClose);

    }

    function prevent(evt) {
      evt.stopPropagation();
    }

    function stayLoggedInPrompt() {
      var stayLoggedInPrompt = $modal.open({
        templateUrl: 'stayLoggedInModal/stayLoggedInModal.html',
        controller: 'StayLoggedInController as StayLoggedIn',
        backdrop: true
      });
    }

  }

})();
