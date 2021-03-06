﻿(function() {
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

  function AppRun(Session,
      $rootScope,
      MESSAGES,
      $http,
      $log,
      $state,
      $timeout,
      $location,
      $cookies,
      $document,
      ContentSiteConfigService,
      SiteConfig) {
    $rootScope.MESSAGES = MESSAGES;
    setOriginForCmsPreviewPane($document);
    fastclick.attach(document.body);

    // Detect Browser Agent. use for browser targeting in CSS
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);
    doc.setAttribute('data-platform', navigator.platform );

    function clearAndRedirect(event, toState, toParams) {
      console.log($location.search());

      Session.clear();
      $rootScope.userid = null;
      $rootScope.username = null;
      Session.addRedirectRoute(toState.name, toParams);
      event.preventDefault();
      $state.go('login');
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'logout') {
        if (fromState.data === undefined || !fromState.data.isProtected) {
          Session.addRedirectRoute(fromState.name, fromParams);
        } else {
          Session.addRedirectRoute('content', {link:'/'});
        }

        return;
      }

      if (fromState.name !== ''
        && fromState.name !== 'logout'
        && fromState.name !== 'login'
        && fromState.name !== 'register'
        && !~fromState.name.toLowerCase().indexOf('password')
        && !~fromState.name.indexOf('give')) {
        Session.addRedirectRoute(fromState.name, fromParams);
      } else if (toState.name !== ''
        && toState.name !== 'logout'
        && toState.name !== 'login'
        && toState.name !== 'register'
        && !~toState.name.toLowerCase().indexOf('password')
        && !~toState.name.indexOf('give')) {
        Session.addRedirectRoute(toState.name, toParams);
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
            Authorization: $cookies.get('sessionId'),
            RefreshToken: $cookies.get('refreshToken')
          }
        }).success(function(user) {
          $rootScope.userid = user.userId;
          $rootScope.username = user.username;
          $rootScope.email = user.userEmail;
          $rootScope.roles = user.roles;
        }).error(function(e) {
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

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      if (toState.data && toState.data.meta) {
        $rootScope.meta = toState.data.meta;
      }

      setupMetaData();
    });

    function setupMetaData() {
      var titleSuffix = ' | ' + ContentSiteConfigService.getTitle();
      $rootScope.meta.siteconfig = ContentSiteConfigService.siteconfig;
      if ($rootScope.meta.title.indexOf(titleSuffix, $rootScope.meta.title.length - titleSuffix.length) === -1) {
        $rootScope.meta.title = $rootScope.meta.title + titleSuffix;
      }

      $rootScope.meta.url = $location.absUrl();
      if (!$rootScope.meta.statusCode) {
        $rootScope.meta.statusCode = '200';
      }

      if (!$rootScope.meta.image || $rootScope.meta.image.filename === '/assets/') {
        $rootScope.meta.image = {
          filename:'https://crossroads-media.s3.amazonaws.com/images/coffee_cup.jpg'
        };
      }
    }

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
