/**
 * Created by jonathan on 09/04/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .directive(frontApp.modules.utils.directives.faSearchLookup, [
    function () {
      return {
        restrict: 'E',
        scope: {
          model: '=ngModel'
        },
        require: ['^form', 'ngModel'],
        replace: false,
        template: '<md-input-container flex> \
        <label>Name</label> \
        <input type="text" name="{{name}}" ng-blur="blur()"  ng-model="model" class="form-control" ng-required="required"> \
        </md-input-container> \
        <div ng-show="!isValid"  > \
        <div>Você <b>Deve</b> selecionar uma matéria.</div> \
        </div>',
        link: function (scope, elem, attrs, ctrl) {
          scope.form = ctrl[0];
          scope.name = attrs.name;
          scope.isValid = true;

          var ngModel = ctrl[1];

          ctrl.untouched = true;
          ctrl.touched   = false;

          console.log(elem);

          /*elem[0].children[0].on('blur', function () {
            console.log('blur');
            scope.$apply(function () {
              ctrl.untouched = false;
              ctrl.touched = true;
              console.log('untouched');
              console.log(ctrl.untouched);
              console.log('touched');
              console.log(ctrl.touched);
            });
          });*/

          function blur(){
            console.log('blur');
          }

          if (attrs.required !== undefined) {
            // If attribute required exists
            // ng-required takes a boolean
            scope.required = true;
          }

          scope.$watch('model', function(newValue) {
            //ngModel.$setViewValue(ngModel.viewValue);
            ngModel.$setViewValue(newValue);
            console.log('newValue');
            console.log(newValue);

            if (scope.required) {
              if (newValue === undefined || newValue === "" || newValue === null) {
                console.log('invalido');

                ngModel.$valid = false;
                scope.isValid = false;
              } else {
                console.log('valido');
                ngModel.$valid = true;
                scope.isValid = true;
              }
            }

            //scope.isValid = ngModel.$valid;
          });

          ctrl[1].$parsers.push(function(viewValue) {
            console.log('viewValue');
            console.log(viewValue);
          });

        }
      };
    }
  ]);
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
