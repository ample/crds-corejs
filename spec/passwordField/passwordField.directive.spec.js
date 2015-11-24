require('../../app/core');

describe('Password Field Directive', function() {

  var scope;
  var $compile;
  var isolate;
  var $rootScope;
  var element;

  beforeEach(function() {
    angular.mock.module('crossroads.core');
  });

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  describe('password meter true', function() {

    beforeEach(function() {
      element =
        '<password-field passwd=\'passwd\' submitted=\'submitted\' passwd-strength=\'true\'> </password-field>';
      scope.passwd = '';
      scope.submitted = false;
      element = $compile(element)(scope);
      scope.$digest();
      isolate = element.isolateScope();
    });

    it('should show the password meter', function() {
      expect(isolate.passwd.showMeter).toBe(true);
    });

  });

  describe('password meter false', function() {
    beforeEach(function() {
      element =
        '<password-field passwd=\'passwd\' submitted=\'submitted\' passwd-strength=\'false\'> </password-field>';
      scope.passwd = '';
      scope.submitted = false;
      element = $compile(element)(scope);
      scope.$digest();
      isolate = element.isolateScope();
    });

    it('should not show the password meter', function() {
      expect(isolate.passwd.showMeter).toBe(false);
    });

  });

  describe('password validity', function() {
    beforeEach(function() {
      element =
        '<password-field passwd=\'passwd\' submitted=\'submitted\'> </password-field>';
      scope.passwd = '';
      scope.minLength = 8;
      scope.submitted = false;
      element = $compile(element)(scope);
      scope.$digest();
      isolate = element.isolateScope();
    });

    it('should have a valid password if the there are more than 8 characters', function() {
      isolate.passwd.passwordForm.password.$setViewValue('passwords');
      expect(isolate.passwd.passwordInvalid()).toBe(false);
    });

    it('should be invalid if there is less than 6 characters', function() {
      isolate.passwd.passwordForm.password.$setViewValue('passw');
      expect(isolate.passwd.passwordInvalid()).toBe(true);
    });

  });

});
