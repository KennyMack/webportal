/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.students.name)
    .controller(frontApp.modules.students.controllers.students.name, [ function () {
      var person = {
        name: 'Jonathan',
        surname: undefined
      };

      this.upload = function () {
        console.log(person);
      };

      this.person = person;

    }]);
}(angular, frontApp));
