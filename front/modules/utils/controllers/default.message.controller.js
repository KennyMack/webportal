/**
 * Created by jonathan on 18/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .controller(frontApp.modules.utils.controllers.defaultMessagesCtrl.name, [
      '$scope', '$mdDialog',
      function ($scope, $mdDialog) {
        $scope.pageHeader = 'Default Container';

        $scope.itemHasImage = true;


        $scope.itemsList = [
          { id: 1, img: '../images/ic_person_mark1.svg', value: 'Hello' }
        ];


        $scope.itemListClick = function (item, event) {
          $mdDialog.show(
            $mdDialog.alert()
              .title('Item-list')
              .textContent(item)
              .ok('Neat!')
              .targetEvent(event)
          );
        };

        $scope.closeClick = function () {
          $mdDialog.cancel();
        };


        $scope.cancelClick = function (event) {
          $mdDialog.show(
            $mdDialog.alert()
              .title('Item-list')
              .textContent('cancel')
              .ok('Neat!')
              .targetEvent(event)
          );
        };

        $scope.confirmClick = function (event) {
          $mdDialog.show(
            $mdDialog.alert()
              .title('Item-list')
              .textContent('Confirm')
              .ok('Neat!')
              .targetEvent(event)
          );
        };

      }
    ]);
}(angular, frontApp));
