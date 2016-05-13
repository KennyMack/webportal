/**
 * Created by jonathan on 19/03/16.
 */
(function (angular, frontApp) {
  'use strict';

  angular.module(frontApp.modules.utils.name)
    .controller(frontApp.modules.utils.controllers.GridListCtrl.name, [
      '$scope','$mdDialog', '$mdMedia',
      function ($scope, $mdDialog, $mdMedia) {
        var vm = this;
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        vm.showGrid = function (grid) {
          var __gluseFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          var __glDataList = grid['data'] || [];
          var __glPageHeader = grid['header'] || 'Default GridList';
          var __glitemHasImage = grid['hasimage'] || false;
          var __glStyle = grid['style'] || 1;

          return $mdDialog.show({
            templateUrl: '../../../templates/gridList.tpl.html',
            openFrom: '#' + grid['destiny'],
            closeTo: '#' + grid['destiny'],
            locals: { itemsList: __glDataList,
              pageHeader: __glPageHeader,
              itemHasImage: __glitemHasImage,
              style: __glStyle
            },
            controller: ['$scope', 'itemsList', 'pageHeader', 'itemHasImage', 'style',
              function($scope, itemsList, pageHeader, itemHasImage, style) {
              $scope.itemsList = itemsList;
                $scope.pageHeader = pageHeader;
                $scope.itemHasImage = itemHasImage;
                $scope.style = style;
                $scope.showText = function (index, type) {
                  if (index === 1){
                    return true;
                  }
                  else if (index === 2){
                    return (type >= 2);
                  }
                  else if (index === 3) {
                    return (type >= 3);
                  }
                };

                $scope.closeClick = function () {
                  $mdDialog.cancel();
                };

                $scope.cancelClick = function () {
                  $mdDialog.cancel();
                };

                $scope.confirmClick = function () {
                  $mdDialog.hide();
                };

                $scope.itemListClick = function (item) {
                  $mdDialog.hide(item);
                };

            }],
            controllerAs: 'gccontroller',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: __gluseFullScreen
          });
        };
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      }

    ]);

}(angular, frontApp));
