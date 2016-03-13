/**
 * Created by jonathan on 12/03/16.
 */

(function (angular, frontApp) {
  'use strict';

  angular.module(frontApp.modules.utils.name)
    .directive(frontApp.modules.utils.directives.usernameValidate, function () {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {

          ctrl.$validators.username = function (modelValue, viewValue) {
            return (viewValue != "");
          };
        }
      };
    });
}(angular, frontApp));


