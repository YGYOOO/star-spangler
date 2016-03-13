var app = angular.module('App', ['ngRoute', 'Document']);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/',{
      templateUrl: 'views/login.html',
      controller: 'loginController'
    }).
    when('/manageUsers',{
      templateUrl: 'views/manageUsers.html',
      controller: 'manageUserController'
    }).
    when('/manageDocuments',{
      templateUrl: 'views/manageDocuments.html',
      controller: 'manageDocumentController'
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
