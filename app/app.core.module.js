'use strict()';
(function() {

  angular.module('crossroads.core', [
    'ngResource',
    'ngSanitize',
    'ngPayments',
    'duScroll',
    'ui.router',
    'ngCookies',
    'ngMessages',
    'angular-growl',
    'angular-stripe',
    'toggle-switch',
    'sn.addthis',
    'ngAside',
    'mailchimp',
    'matchMedia',
    'ui.bootstrap',
    'ui.mask',
    'ngImgCrop',
    'angular-stripe'
    ])
    .constant('AUTH_EVENTS', {
      loginSuccess: 'auth-login-success',
      loginFailed: 'auth-login-failed',
      logoutSuccess: 'auth-logout-success',
      sessionTimeout: 'auth-session-timeout',
      notAuthenticated: 'auth-not-authenticated',
      isAuthenticated: 'auth-is-authenticated',
      notAuthorized: 'auth-not-authorized'
    })

    //TODO Pull out to service and/or config file
    .constant('MESSAGES', {})

    .config(function(growlProvider) {
      growlProvider.globalPosition('top-center');
      growlProvider.globalTimeToLive(6000);
      growlProvider.globalDisableIcons(true);
      growlProvider.globalDisableCountDown(true);
    })
    .directive('emptyToNull', require('./shared/emptyToNull.directive.js'))
    .directive('stopEvent', require('./shared/stopevent.directive.js'))
    .directive('requireMultiple', require('./shared/requireMultiple.directive.js'))
    .directive('autofocus', require('./shared/autofocus.directive.js'))
    .factory('ContentPageService', require('./cms/services/content_page.service'))
    .factory('ContentSiteConfigService', require('./cms/services/content_siteconfig.service'))
    .factory('ResponsiveImageService', require('./components/responsiveImage/responsiveImage.service'))
    .factory('PageRenderedService', require('./components/pageRendered/pageRendered.service'))
    .factory('AttributeTypeService', require('./services/attributeType.service'));

})();
