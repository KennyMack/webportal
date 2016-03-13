/**
 * Created by jonathan on 12/03/16.
 */
(function(angular, frontApp) {
  'use strict';
  angular.module(frontApp.modules.utils.name)
    .factory(frontApp.modules.utils.services.messages, function ($mdDialog) {
      return {
        confirm: function (title, content, origin) {
          var mConfirm = $mdDialog.confirm();
          if (origin) {
            mConfirm.openFrom('#'+origin);
            mConfirm.closeTo('#'+origin);
          }
          if (title)
            mConfirm.title(title);
          if (content)
            mConfirm.content(content);
          mConfirm.ok('Sim').cancel('Não');

          return $mdDialog.show(mConfirm);
        },
        alert: function (title, content, origin) {
          var mAlert = $mdDialog.alert();
          if (origin) {
            mAlert.openFrom('#'+origin);
            mAlert.closeTo('#'+origin);
          }
          if (title)
            mAlert.title(title);
          if (content)
            mAlert.content(content);
          mAlert.ok('OK');

          return $mdDialog.show(mAlert);
        }
      };
    });
}(angular, frontApp));
