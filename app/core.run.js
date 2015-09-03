(function () {
  'use strict';
  angular.module('crossroads.core').run(AppRun);

  AppRun.$inject = ['Session',
    '$rootScope',
    'MESSAGES',
    '$http',
    '$log',
    '$state',
    '$timeout',
    '$location',
    '$cookies',
    '$document',
    'ContentSiteConfigService',
    'SiteConfig'];

  function AppRun(Session, $rootScope, MESSAGES, $http, $log, $state, $timeout, $location, $cookies, $document, ContentSiteConfigService, SiteConfig) {
    $rootScope.MESSAGES = MESSAGES;
    setOriginForCmsPreviewPane($document);

    SiteConfig.get({id:1}).$promise.then(function(result ) {
          ContentSiteConfigService.siteconfig = result.siteConfig;
        }
      );

    function clearAndRedirect(event, toState, toParams) {
      console.log($location.search());

      Session.clear();
      $rootScope.userid = null;
      $rootScope.username = null;
      Session.addRedirectRoute(toState.name, toParams);
      event.preventDefault();
      $state.go('login');
    }

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'logout') {
        if (fromState.data === undefined || !fromState.data.isProtected) {
          Session.addRedirectRoute(fromState.name, fromParams);
        }
        else {
          Session.addRedirectRoute('home', '');
        }
        return;
      }

      if (toState.data !== undefined && toState.data.preventRouteAuthentication) {
        return;
      }
      if (Session.isActive()) {
        $http({
          method: 'GET',
          url: __API_ENDPOINT__ + 'api/authenticated',
          withCredentials: true,
          headers: {
            'Authorization': $cookies.get('sessionId')
          }
        }).success(function (user) {
          $rootScope.userid = user.userId;
          $rootScope.username = user.username;
          $rootScope.roles = user.roles;
        }).error(function (e) {
          clearAndRedirect(event, toState, toParams);
        });
      } else if (toState.data !== undefined && toState.data.isProtected) {
        clearAndRedirect(event, toState, toParams);
      } else {
        $rootScope.userid = null;
        $rootScope.username = null;
      }
      //}
    });
    $rootScope.$on("$stateChangeSuccess", function(event, toState){
      if (toState.resolve && toState.resolve.Meta){
        debugger;
        $rootScope.meta = toState.resolve.Meta();
      } else if (toState.data && toState.data.meta){
        debugger;
        $rootScope.meta = toState.data.meta;
        if(ContentSiteConfigService.siteconfig.title){
          $rootScope.meta.title = $rootScope.meta.title +
            ' | ' + ContentSiteConfigService.siteconfig.title;
        } else {
          $rootScope.meta.title = $rootScope.meta.title +
            ' | ' + 'Crossroads';
        }
      }
    });

    function setOriginForCmsPreviewPane($document) {
      var document = $document[0];

      // work-around for displaying cr.net inside preview pane for CMS
      var domain = document.domain;
      var parts = domain.split('.');
      if (parts.length === 4) {
        // possible ip address
        var firstChar = parts[0].charAt(0);
        if (firstChar >= '0' && firstChar <= '9')  {
          // ip address
          document.domain = domain;
          return;
        }
      }

      while (parts.length > 2) {
        parts.shift();
      }

      document.domain = parts.join('.');
    }
  }
})();
