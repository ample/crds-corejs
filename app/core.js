(function(){
  'use strict';

  require('lodash');
  require('expose?moment!moment');
  require('expose?imgix!../lib/imgix.min');
  require('expose?fastclick!fastclick');

  require('../lib/angular-growl');

  require('../lib/angular-aside.css');
  require('../lib/angular-growl.css');
  require('../lib/ng-img-crop.css');

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
  require('./components/interceptor');
  require('./email_field/email_field_directive');
  require('./date_field/date_field_directive');
  require('./date_field/datepicker_validator');
  require('./passwordField');
  require('./register/register_directive');
  require('./cms/services/cms_services_module');

  require('./profile/picture');

  // Common Services
  require('./content');
  require('./filters');

  require('./core.config');
  require('./core.controller');
  require('./core.run');
  require('./services/session_service');

  require('./errors');

  // require and export crds_utilities on global scope
  require('expose?crds_utilities!./crds_utilities.js');
})();
