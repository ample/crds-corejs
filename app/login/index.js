(function() {
  'use strict';

  angular.module('crossroads.core')
    .controller('LoginController', require('./login_controller'))
    .directive('loginForm', ['$log', 'AUTH_EVENTS', require('./login_form_directive')])
    ;

  require('./login_form.html');
  require('./login_page.html');
  require('./forgot_password.html');
  require('./reset_password.html');
})();
