var Document = angular.module('Document', ['ngRoute', 'ngResource']);

Document.factory('User', ['$resource', function($resource) {
return $resource('/api/users/:emailAddress', null,
    {
        'update': { method:'PUT' }
    });
}]);

Document.controller('documentsController', ['$scope', '$resource',
  function($scope, $resource){
    var Articles = $resource('/api/document');

    $scope.articles = Articles.query();
  }
]);

Document.controller('manageUserController', ['$scope', '$resource', '$location', 'User',
  function($scope, $resource, $location, User){
    $scope.getUser = function(){
      $.ajax('/api/user',
      {
        type: 'GET',
        success: function(u){ $scope.user = u;$scope.$apply()},
        error: function(e){$location.path('/');$scope.$apply()}
      });
    };

  var Users = $resource('/api/users');
  $scope.users = Users.query();
  $scope.changeType = function(emailAddress, box){
    if(box.check)
      user= {userType: 'admin'};
    else
      user= {userType: 'user'};
    User.update({emailAddress: emailAddress}, user);
    }
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
          $location.path('/manageUsers');
        }
        else if(loggedUser.userType === 'user'){
          $location.path('/manageDocuments');
        }
      });
    };
  }
]);
