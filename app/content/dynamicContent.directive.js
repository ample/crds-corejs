module.exports = DynamicContentDirective;

DynamicContentDirective.$inject = ['$compile'];

function DynamicContentDirective($compile) {
 return {
      restrict: 'A',
      replace: true,
      link: function (scope, ele, attrs) {
        scope.$watch(attrs.dynamicContent, function(html) {
          ele.html(html);
          $compile(ele.contents())(scope);
        });
      }
    }; 
}
