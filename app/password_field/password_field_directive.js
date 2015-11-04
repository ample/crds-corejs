require('./password_field.html');

(function () {
    angular.module("crossroads.core").directive("passwordField", ['$log', 'zxcvbn', PasswordField]);

    function PasswordField($log, zxcvbn) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                passwd: "=passwd",
                submitted: "=",
                prefix: "=prefix",
                required: "@required"
            },
            templateUrl: 'password_field/password_field.html',
            link: (function (scope, el, attr, ctrl) {
                //scope.showPassword = false;
                scope.inputType = 'password';
                scope.pwprocessing = "SHOW";
                scope.passwordStrengthProgressClass = "progress-bar-danger";
                scope.passwordStrengthProgressLabel = 'Weak';

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
                  //console.log(scope.passwordStrength);
                  //$log.debug(scope.passwordStrength);

                  scope.passwordStrengthProgress = (scope.passwordStrength.score/4) * 100; 
                  switch (scope.passwordStrength.score) {
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
