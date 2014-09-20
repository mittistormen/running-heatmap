angular.module('the-map', ['ui.router', 'ngResource', 'google-maps']);

angular.module('the-map').config(function ($stateProvider, $urlRouterProvider) {
  'use strict';

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'partial/home/home.html'
  });
  $stateProvider.state('lab', {
    url: '/lab',
    templateUrl: 'partial/lab/lab.html'
  });
	$stateProvider.state('lab2', {
    url: '/lab2',
    templateUrl: 'partial/lab2/lab2.html'
  });
	/* Add New Routes Above */
  
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/home");

});

angular.module('the-map').run(function ($rootScope) {
  'use strict';

  $rootScope.safeApply = function (fn) {
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

});