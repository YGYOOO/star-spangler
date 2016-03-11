var app = angular.module('App', ['ngRoute', 'Document']);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/',{
      templateUrl: 'views/login.html',
      controller: 'loginController'
    }).
    when('/admin',{
      templateUrl: 'views/manageUser.html',
      controller: 'manageUserController'
    }).
    when('/admin/manageUser',{
      templateUrl: 'views/manageUser.html',
      controller: 'manageUserController'
    }).
    otherwise({
      redirectTo: '/'
    });


  // $routeProvider.
  //     when('/phones', {
  //       templateUrl: 'partials/phone-list.html',
  //       controller: 'PhoneListCtrl'
  //     }).
  //     when('/phones/:phoneId', {
  //       templateUrl: 'partials/phone-detail.html',
  //       controller: 'PhoneDetailCtrl'
  //     }).
  //     otherwise({
  //       redirectTo: '/phones'
  //     });
}]);
