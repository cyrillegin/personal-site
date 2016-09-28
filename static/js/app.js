// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.

'use strict';

var app = angular.module('lifeTreks', [
  'lifeTreks.main',
  'lifeTreks.homepageblog',
  'lifeTreks.videoblog',
  'lifeTreks.galleryController'
])

.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://www.youtube.com/**'
  ]);
});

// app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
//     $routeProvider.otherwise({redirectTo: '/'});

//     $routeProvider.when('/', {
//         templateUrl: 'index.html',
//         controller: 'lifeTreksMain',
//         reloadOnSearch: false
//     });

//     $locationProvider.html5Mode({
//       enabled: true,
//       requireBase: false
//     });

//     $httpProvider.useApplyAsync(true);
// }]);
