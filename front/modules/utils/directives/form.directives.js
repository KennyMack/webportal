/**
 * Created by jonathan on 09/04/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .directive(frontApp.modules.utils.directives.inputRequired, [
    function () {
      return {
        restrict: 'E',
        template: '<input />',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
          console.log('scope');
          console.log(scope);
          console.log('elem');
          console.log(elem);
          console.log('attrs');
          console.log(attrs);
          console.log('ctrl');
          console.log(ctrl);

          ctrl.$parsers.push(function(viewValue) {
            if(viewValue === "") {
              return null;
            }
            return viewValue;
          });
        }
      };
    }
  ]);
}(angular, frontApp));
