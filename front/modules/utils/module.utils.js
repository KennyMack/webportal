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
      removeAccents: 'removeAccentsFilter',
      searchFilter: 'searchFilter'
    },
    directives: {
      faSearchLookup: 'faSearchLookup',
      faInput: 'faInput',
      faBlur: 'faBlur',
      faSearchBlur: 'faSearchBlur'
    }
  };

  angular.module(frontApp.modules.utils.name, [
    'ngMaterial'
  ]);
}(angular, frontApp));
