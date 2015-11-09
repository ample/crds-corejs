require('./password_field.html');

(function () {
    angular.module("crossroads.core").directive("passwordField", ['$log', '$location', 'zxcvbn', PasswordField]);

    function PasswordField($log, $location, zxcvbn) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                passwd: "=passwd",
                submitted: "=",
                prefix: "=prefix",
                required: "@required",
                passwdStrength: "="
            },
            templateUrl: 'password_field/password_field.html',
            link: (function (scope, el, attr, ctrl) {
                //scope.showPassword = false;
                scope.inputType = 'password';
                scope.pwprocessing = "SHOW";
                scope.passwordStrengthProgressClass = "danger";
                scope.passwordStrengthProgressLabel = '';
                scope.showMeter = false;
                scope.isCollapsed = true;

                if (scope.passwdStrength) {
                  scope.showMeter = true;
                }

                scope.pwprocess = function () {
                    if (scope.pwprocessing == "SHOW") {
                        scope.pwprocessing = "HIDE";
                        scope.inputType = 'text';
                    }
                    else {
                        scope.pwprocessing = "SHOW";
                        scope.inputType = 'password';
                    }
                    $log.debug(scope.pwprocessing);
                }

                scope.$watch("passwd", function() {
                  scope.passwordStrength = zxcvbn(scope.passwd);

                  scope.passwordStrengthProgress = (scope.passwordStrength.score/4) * 100;
                  switch (scope.passwordStrength.score) {
                    case 1:
                      scope.passwordStrengthProgressClass = 'danger';
                      scope.passwordStrengthProgressLabel = 'Weak';
                      break;
                    case 2:
                      scope.passwordStrengthProgressClass = 'warning';
                      scope.passwordStrengthProgressLabel = 'Fair';
                      break;
                    case 3:
                      scope.passwordStrengthProgressClass = 'success';
                      scope.passwordStrengthProgressLabel = 'Good';
                      break;
                    case 4:
                      scope.passwordStrengthProgressClass = 'success';
                      scope.passwordStrengthProgressLabel = 'Great!';
                      break;
                    default:
                      scope.passwordStrengthProgressClass = 'danger';
                      scope.passwordStrengthProgressLabel = 'Weak';
                  }

                });

            })
        }
    }
})()
