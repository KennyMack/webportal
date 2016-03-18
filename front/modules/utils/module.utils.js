/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  frontApp.modules.utils = {
    name: 'utils',
    controllers: {
      defaultMessagesCtrl: {
        name: 'DefaultMessagesCtrl',
        nameas: 'defaultMessages'
      }
    },
    factories:{
      request: 'requestFactory',
      resource: 'resourceFactory'
    },
    services: {
      localSave: 'localSaveService',
      messages: 'messagesService'
    },
    directives: {
      usernameValidate: 'usernameValidateDirective'
    }
  };

  angular.module(frontApp.modules.utils.name, [
    'ngMaterial'
  ]);
}(angular, frontApp));
