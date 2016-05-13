/**
 * Created by jonathan on 09/04/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .directive(frontApp.modules.utils.directives.faBlur, function () {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          element.bind('blur', function () {
            scope.$apply(attr.faBlur);
          });
        }
      };
    })
    .directive(frontApp.modules.utils.directives.faInput, [
      function () {
        return {
          restrict: 'E',
          scope: {
            model: '=ngModel'
          },
          require: ['^form', 'ngModel'],
          replace: false,
          templateUrl: '../../../templates/forms/input.tpl.html',
          link: function (scope, elem, attrs, ctrl) {
            scope.form = ctrl[0];
            scope.name = attrs.name;
            scope.isValid = true;
            scope.label = attrs.label;
            scope.blur = false;
            scope.requiredValue = ' ';

            var ngModel = ctrl[1];

            if (attrs.notnull !== undefined) {
              scope.required = true;
              scope.notnull = attrs.notnull;
              scope.requiredValue += '*';
            }

            scope.log = function(){
              scope.blur = true;
              validate(ngModel.$modelValue);
            };

            function validate(value){
              if (scope.required) {
                if (value === undefined || value === "" || value === null) {
                  ngModel.$valid = false;
                  if (scope.blur)
                    scope.isValid = false;
                } else {
                  ngModel.$valid = true;
                  scope.isValid = true;
                }
              }
            }

            scope.$watch('model', function(newValue) {
              ngModel.$setViewValue(newValue);
              validate(newValue);
            });

          }
        };
      }
    ])
    .directive(frontApp.modules.utils.directives.faSearchBlur, function($timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attributes){
          $timeout(function(){
            angular.element(element[0].querySelector("input.md-input")).bind("blur", function(){
              $timeout(function() {
                scope.$eval(attributes.faSearchBlur);
              }, 100);
            });
          },0);
        }
      };
    });
}(angular, frontApp));


//return {
//  restrict: 'E',
//  scope: {
//    type: '=',
//    ngModel: '=ngModel'
//  },
//  link: function(scope, element, attrs) {
//    var templates = {};
//    templates['text'] = '<input type ="text" name="{{name}}" ng-model="ngModel">';
//    templates['radio'] = '<input ng-repeat="option in optionsList" name="{{name}}" type="radio">';
//    if (templates[scope.type]) {
//      console.log(scope.ngModel);
//      scope.optionsList = scope.type.data;
//      scope.name = scope.type.name;
//      element.append($compile(templates[scope.type])(scope));
//    } else {
//      element.html("");
//    }
//    //$compile(element.contents())(scope);
//  }
//}


//function () {
//  return {
//    restrict: 'E',
//    scope: {
//      model: '=ngModel'
//    },
//    require: ['^form', 'ngModel'],
//    replace: false,
//    template: '<md-input-container flex>'+
//    '<label>Name</label>'+
//    '<input type="text" name="name" ng-model="model" class="form-control" ng-required="required">'+
//    '</md-input-container>' +
//    '<div ng-show="form.model.$error.required" ng-if="form.model.$touched" >' +
//    '<div>Você <b>Deve</b> selecionar uma matéria.</div>' +
//    '</div>',
//    link: function (scope, elem, attrs, ctrl) {
//      scope.form = ctrl[0];
//      var ngModel = ctrl[1];
//
//      console.log('ngModel');
//      console.log(ngModel);
//
//      ctrl.untouched = true;
//      ctrl.touched   = false;
//
//      /*elem.on('blur', function (){
//       console.log('blur');
//       scope.$apply(function () {
//       ctrl.untouched = false;
//       ctrl.touched   = true;
//       console.log('untouched');
//       console.log(ctrl.untouched);
//       console.log('touched');
//       console.log(ctrl.touched);
//       });
//       });*/
//
//      if (attrs.required !== undefined) {
//        // If attribute required exists
//        // ng-required takes a boolean
//        scope.required = true;
//      }
//
//      scope.$watch('name', function() {
//        ngModel.$setViewValue(scope.name);
//        console.log('ngModel.$touched');
//        console.log(ngModel.$touched);
//      });
//
//
//
//      //<input type="text" name="name" ng-model="name" class="form-control" ng-required="required">
//
//      //<span ng-show="form.name.$error.required" class="help-block">Can't be blank</span>
//
//
//
//      /*console.log('scope');
//       console.log(scope);
//       console.log('elem');
//       console.log(elem);
//       console.log('attrs');
//       console.log(attrs);
//       console.log('ctrl');
//       console.log(ctrl);*/
//
//      /*console.log('scope.required');
//       console.log(scope.required);
//
//       scope.required = false;
//
//       scope.$watch('model', function(newValue, oldValue) {
//       console.log('Sujo');
//       console.log(ctrl.$dirty);
//
//       if (newValue === undefined || newValue === "" || newValue === null)
//       scope.required = true;
//       console.log('newValue');
//       console.log(newValue);
//       console.log('oldValue');
//       console.log(oldValue);
//
//       console.log('ctrl');
//       console.log(ctrl);
//       });
//
//       scope.$watch('val', function(newValue, oldValue) {
//       if (newValue)
//       console.log("I see a data change!");
//       }, true);
//
//
//       ctrl.$parsers.push(function(viewValue) {
//       if(viewValue === "") {
//       return null;
//       }
//       return viewValue;
//       });*/
//    }
//  };
//}

//.directive(frontApp.modules.utils.directives.faSearchLookup, [
//  function () {
//    return {
//      restrict: 'E',
//      scope: {
//        model: '=ngModel'
//      },
//      require: ['^form', 'ngModel'],
//      replace: false,
//      templateUrl: '../../../templates/forms/searchLookup.tpl.html',
//      link: function (scope, elem, attrs, ctrl) {
//        scope.form = ctrl[0];
//        scope.name = attrs.name;
//        scope.isValid = true;
//        scope.label = attrs.label;
//        scope.blur = false;
//
//        var ngModel = ctrl[1];
//
//        if (attrs.notnull !== undefined) {
//          scope.required = true;
//          scope.notnull = attrs.notnull;
//        }
//
//        scope.log = function(){
//          scope.blur = true;
//          validate(ngModel.$modelValue);
//        };
//
//        function validate(value){
//          if (scope.required) {
//            if (value === undefined || value === "" || value === null) {
//              ngModel.$valid = false;
//              if (scope.blur)
//                scope.isValid = false;
//            } else {
//              ngModel.$valid = true;
//              scope.isValid = true;
//            }
//          }
//        }
//
//        scope.$watch('model', function(newValue) {
//          ngModel.$setViewValue(newValue);
//          validate(newValue);
//        });
//
//      }
//    };
//  }
//]).
