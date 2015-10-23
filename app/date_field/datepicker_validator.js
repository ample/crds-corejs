(function() {
  angular.module('crossroads.core').directive('datepickerValidator', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.minDate = function(value) {
          if (!attrs.minDate) {
            return false;
          }

          var valueDate = value;
          if (typeof value === 'string' || value instanceof String) {
            var parts = value.split('/');
            valueDate = new Date(parts[2], parts[0] - 1, parts[1]);
          }

          var minDate = new Date(attrs.minDate.replace(/['"]+/g, ''));
          if (valueDate >= minDate) {
            return true;
          } else {
            return false;
          }
        };

        ngModel.$validators.maxDate = function(value) {
          if (!attrs.maxDate) {
            return false;
          }

          var valueDate = value;
          if (typeof value === 'string' || value instanceof String) {
            var parts = value.split('/');
            valueDate = new Date(parts[2], parts[0] - 1, parts[1]);
          }

          var maxDate = new Date(attrs.maxDate.replace(/['"]+/g, ''));
          if (valueDate <= maxDate) {
            return true;
          } else {
            return false;
          }
        };
      }
    };
  });
})();
