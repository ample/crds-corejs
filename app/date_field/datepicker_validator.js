'use strict';
(function() {
  module.exports = DatepickerValidator;

  DatepickerValidator.$inject = [];

  function convertDate(value) {
    if (typeof value === 'string' || value instanceof String) {
      var parts = value.split('/');
      if (parts.length === 2) {
        value = new Date(parts[1], parts[0] - 1, 1);
      } else if (parts.length === 3) {
        value = new Date(parts[2], parts[0] - 1, parts[1]);
      }
    }

    return value;
  }

  function convertISODate(dateString) {
    return new Date(dateString.replace(/['"]+/g, ''));
  }

  function DatepickerValidator() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.minDate = function(value) {
          if (!attrs.minDate) {
            return true;
          }

          var valueDate = convertDate(value);

          var minDate = convertISODate(attrs.minDate);
          if (valueDate >= minDate) {
            return true;
          } else {
            return false;
          }
        };

        ngModel.$validators.maxDate = function(value) {
          if (!attrs.maxDate) {
            return true;
          }

          var valueDate = convertDate(value);

          var maxDate = convertISODate(attrs.maxDate);
          if (valueDate <= maxDate) {
            return true;
          } else {
            return false;
          }
        };
      }
    };
  }
})();
