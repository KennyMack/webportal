/**
 * Created by jonathan on 13/03/16.
 */
(function (angular, frontApp) {
  'use strict';
  frontApp.modules.handlers = {
    name: 'handlers',
    controllers: {
      notAuthorized: {
        name: 'NotAuthorizedCtrl',
        nameas: 'notauthorized'
      },
      notFound: {
        name: 'NotFoundCtrl',
        nameas: 'notfound'
      },
      serverError: {
        name: 'ServerErrorCtrl',
        nameas: 'servererror'
      }
    },
    routes: {
      notAuthorized: URLS.NOTAUTHORIZED(),
      notFound: URLS.NOTFOUND(),
      serverError: URLS.SERVERERROR()
    },
    factories: {
      notFound: 'notFoundInterceptorFactory',
      notAuthorized: 'notAuthorizedInterceptorFactory',
      serverError: 'serverErrorInterceptorFactory'
    },
    templates: {
      notAuthorized:{
        url: '401.html'
      },
      notFound:{
        url: '404.html'
      },
      serverError:{
        url: '5xx.html'
      }
    }
  };
  angular.module(frontApp.modules.handlers.name, [
    'ngRoute'
  ])
}(angular, frontApp));
