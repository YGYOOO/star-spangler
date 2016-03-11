var Document = angular.module('Document', ['ngRoute', 'ngResource']);

Document.controller('documentsController', ['$scope', '$resource',
  function($scope, $resource){
    var Articles = $resource('/api/document');

    $scope.articles = Articles.query();
  }
]);

Document.controller('manageUserController', ['$scope', '$resource', '$location',
  function($scope, $resource, $location){
    $scope.getUser = function(){
      $.ajax('/api/user',
      {
        type: 'GET',
        success: function(u){ $scope.user = u;},
        error: function(){$location.path('/')}
      });
    };
  }]);

Document.controller('loginController', ['$scope', '$resource', '$location',
  function($scope, $resource, $location){
    var login = $resource('/api/login');

    $scope.login = function(){
      var body = {emailAddress: $scope.emailAddress,
                  password: $scope.password
                  };
      login.save(body, function(loggedUser, responseHeaders){
        if(loggedUser.userType === 'admin'){
          $location.path('/admin');
        }
        else if(loggedUser.userType === 'user'){
          $location.path('/user');
        }
      });
    };
  }
]);
