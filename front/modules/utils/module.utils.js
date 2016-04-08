/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  frontApp.modules.utils = {
    name: 'utils',
    controllers: {
      GridListCtrl: {
        name: 'GridListCtrl',
        nameas: 'gridlist'
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
    filters:{
      removeAccents: 'removeAccentsFilter'
    }
  };

  angular.module(frontApp.modules.utils.name, [
    'ngMaterial'
  ]);
}(angular, frontApp));
