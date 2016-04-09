/**
 * Created by jonathan on 09/04/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.main.name)
    .factory(frontApp.modules.main.factories.principalButtonFactory, [
      function () {
        return {
          showButton: function (next) {
            if (next.showButton != undefined){
              return (next.showButton);
            }
            return true;
          }
        };
      }
    ]);
}(angular, frontApp));
