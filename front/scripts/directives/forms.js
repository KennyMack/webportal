/**
 * Created by jonathan on 12/03/16.
 */
angular.module('utils.formsDirective', [])
  .directive('usernameValidate', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {

          ctrl.$validators.username = function (modelValue, viewValue) {
            return (viewValue != "");
        };
      }
    };
  });
