(function() {
  'use strict';

  require('../../../app/core');

  describe('EmailBox Directive', function() {

    var $compile;
    var element;
    var emailBox;
    var $httpBackend;
    var isolateScope;
    var $rootScope;
    var scope;

    beforeEach(function() {
      angular.mock.module('crossroads.core');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_,_$httpBackend_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET(/SiteConfig*/).respond('');
      element = '<email-box send-message-callback=\'sendMessageCallback(message)\' >' +
        '</email-box';
      scope.sendMessageCallback = function(message) {};

      element = $compile(element)(scope);
      scope.$digest();
      emailBox = element.isolateScope().emailBox;
    }));

    it('should call the send message callback', function() {
      spyOn(scope, 'sendMessageCallback');
      emailBox.sendMessage();
      expect(scope.sendMessageCallback).toHaveBeenCalled();
    });

    it('should call the send message callback with the correct text', function() {
      spyOn(scope, 'sendMessageCallback').and.callThrough();
      emailBox.messageText = 'this is a test';
      emailBox.sendMessage();
      expect(scope.sendMessageCallback).toHaveBeenCalledWith('this is a test');
    });

    it('should default isMessageToggled to false', function() {
      expect(emailBox.isMessageToggled).toEqual(false);
    });

  });
})();
