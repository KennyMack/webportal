/**
 * Created by jonathan on 12/03/16.
 */
(function(angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .factory(frontApp.modules.utils.services.messages, [
      '$mdDialog',
      '$mdMedia',
    function (/*DefaultMessagesCtrl, */$mdDialog, $mdMedia) {
      console.log(frontApp.modules.utils.controllers.defaultMessagesCtrl.name);
      return {
        confirm: function (title, content, origin, destiny) {
          var mConfirm = $mdDialog.confirm();
          if (origin && !destiny) {
            mConfirm.openFrom('#' + origin);
            mConfirm.closeTo('#' + origin);
          }
          else if (origin && destiny) {
            mConfirm.openFrom('#' + origin);
            mConfirm.closeTo('#' + destiny);
          }
          if (title)
            mConfirm.title(title);
          if (content)
            mConfirm.content(content);
          mConfirm.ok('Sim').cancel('Não');

          return $mdDialog.show(mConfirm);
        },
        alert: function (title, content, origin, destiny) {
          var mAlert = $mdDialog.alert();
          if (origin && !destiny) {
            mAlert.openFrom('#' + origin);
            mAlert.closeTo('#' + origin);
          }
          else if (origin && destiny) {
            mAlert.openFrom('#' + origin);
            mAlert.closeTo('#' + destiny);
          }
          if (title)
            mAlert.title(title);
          if (content)
            mAlert.content(content);
          mAlert.ok('OK');

          return $mdDialog.show(mAlert);
        },
        dialog: function (tpl, controller, origin, destiny) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
          return $mdDialog.show({
            templateUrl: tpl,
            openFrom: '#'+destiny,
            closeTo: '#'+destiny,
            controller:  controller,
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            fullscreen: true
          });
            /*.then(function (answer) {
              $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
              $scope.status = 'You cancelled the dialog.';
            });
          $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
          }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
          });*/
        }
      };
    }]);
}(angular, frontApp));
