/**
 * Created by jonathan on 17/04/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .filter(frontApp.modules.utils.filters.genderFilter, [
      function () {
        return function (text) {
          console.log(text);
          return GENDER.GENDER_DESCRIPTION(text);
        }
      }
    ]);
}(angular, frontApp));
