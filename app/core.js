(function(){
  'use strict';

  require('angular');
  require('angular-resource');
  require('angular-sanitize');
  require('angular-messages');
  require('angular-cookies');
  require('../lib/angular-growl');
  require('angular-toggle-switch');
  require('ui-event');
  require('ui-mask');
  require('angular-scroll');
  require('angular-stripe');
  require('angular-payments');
  require('angular-bootstrap-npm');
  require('angular-ui-router');
  require('angular-addthis');
  require('angular-aside');
  require('angular-match-media');
  require('angular-mailchimp');
  require('lodash');
  require('angular-image-crop');
  require('expose?imgix!../lib/imgix.min');


  require('../node_modules/angular-toggle-switch/angular-toggle-switch-bootstrap.css');
  require('../node_modules/angular-toggle-switch/angular-toggle-switch.css');
  require('../lib/angular-aside.css');
  require('../lib/angular-growl.css');
  require('../lib/ng-img-crop.css');

  require('expose?moment!moment');

  require('../styles/main.scss');

  require('./content/sidebarContent.html');
  require('./templates/nav.html');
  require('./templates/nav-mobile.html');
  require('./templates/footer.html');
  require('./templates/header.html');
  require('./templates/brand-bar.html');

  require('./app.core.module');
  require('./login');
  require('./logout');

  // Common Components
  require('./components/btnLoading.directive');
  require('./components/svgIcon.directive');
  require('./components/preloader');
  require('./components/volunteer_applications');
  require('./components/loadingButton');
  require('./components/emailBox');
  require('./components/stayLoggedInModal');
  require('./email_field/email_field_directive');
  require('./date_field/date_field_directive');
  require('./password_field/password_field_directive');
  require('./register/register_directive');
  require('./cms/services/cms_services_module');


  // Common Services
  require('./content');
  require('./filters');


  require('./core.config');
  require('./core.controller');
  require('./core.run');

  require('./errors');

  // require and export crds_utilities on global scope
  require('expose?crds_utilities!./crds_utilities.js');
})();
