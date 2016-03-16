var app = angular.module('App', ['ngRoute', 'Document']);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/',{
      templateUrl: 'views/login.html',
      controller: 'loginController'
    }).
    when('/manageUsers',{
      templateUrl: 'views/manageUsers.html',
      controller: 'manageUsersController'
    }).
    when('/manageDocuments',{
      templateUrl: 'views/manageDocuments.html',
      controller: 'manageDocumentsController'
    }).
    when('/viewDocuments', {
      templateUrl: 'views/viewDocuments.html',
      controller: 'viewDocumentsController'
    }).
    when('/editProfile',{
      templateUrl: 'views/editProfile.html',
      controller: 'editProfileController'
    }).
    otherwise({
      redirectTo: '/'
    });

    // app.service('global', function () {
    //     var users = [];
    //     var documents = [];
    //
    //     return {
    //         getUsers: function () {
    //             return users;
    //         },
    //         setUsers: function(user) {
    //             users.push(user);
    //         },
    //         getDocuments: function () {
    //             return documents;
    //         },
    //         setDocuments: function(document1) {
    //             documents.push(document1);
    //         }
    //     };
    // });
}]);
