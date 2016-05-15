/**
 * Created by jonathan on 20/03/16.
 */
(function (angular, frontApp) {
  angular.module(frontApp.modules.index.name)
    .directive(frontApp.modules.index.directives.actionDirective, [
      '$window',
      function ($window) {
        return {
          link: function(scope) {
            angular.element($window).on('resize', function(e) {
              scope.$broadcast('actionDirective::NEW');
            });
          }
        }
      }
    ]);
}(angular,frontApp));
