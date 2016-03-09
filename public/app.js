var app = angular.module('App',[
  'ngRoute',
  'Document'
]);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/',{
    templateUrl: 'views/document.html',
    controller: 'documentsController'
  });
}]);
