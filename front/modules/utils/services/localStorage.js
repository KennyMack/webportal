/**
 * Created by jonathan on 12/03/16.
 */
(function(angular, frontApp) {
  "use strict";
  angular.module(frontApp.modules.utils.name)
    .service(frontApp.modules.utils.services.localSave,
      function ($window) {
        return {
          getValueLS: function (key) {
            return $window.localStorage.getItem(key);
          },
          setValueLS: function (key, value) {
            $window.localStorage.setItem(key, value);
          },
          getJSONValueLS: function (key) {
            try {
              return JSON.parse($window.localStorage.getItem(key));
            }
            catch (e) {
              return {};
            }
          },
          setJSONValueLS: function (key, value) {
            $window.localStorage.setItem(key, JSON.stringify(value));
          },
          removeValueLS: function (key) {
            console.log('removeValueLS');
            $window.localStorage.removeItem(key);
          }
        }
      });
}(angular, frontApp));
