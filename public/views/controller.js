// $.bridget( 'masonry', masonry );

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

Document.controller('manageUsersController', ['$scope', '$resource', '$location', 'User', 'global',
  function($scope, $resource, $location, User, global){
    var Users = $resource('/api/users');
    $scope.users = Users.query();

    $scope.getUser = function(){
      $.ajax('/api/user',
      {
        type: 'GET',
        success: function(u){ $scope.user = u;$scope.$apply()},
        error: function(e){$location.path('/');$scope.$apply()}
      });
    };

    $scope.changeType = function(emailAddress, box){
      if(box.check)
        user= {userType: 'admin'};
      else
        user= {userType: 'user'};
      User.update({emailAddress: emailAddress}, user);
      }

    $scope.addUser = function(){
      var body = {emailAddress: $scope.emailAddress}
      Users.save(body, function(addedUser, responseHeaders){
        $scope.users.push(addedUser);
      });
    }

    $scope.addToList = function(email){
      document.getElementById("selectedPanel").classList.add('popUp');
      var exist = false;
      var users = global.getUsers();
      for(var i=0; i<users.length; i++){
        if(users[i] === email)
          exist = true;
      }
      if(!exist){
        global.setUsers(global.setUsers(email));
        var child = '<div class="chip userChip" id="tag' + email + '">' + email + '<i class="material-icons">close</i></div>'
        $('#selectedUsers').append(child);
      }
    }

}]);

Document.controller('manageDocumentsController', ['$scope', '$resource', 'global',
  function($scope, $resource, global){
    $scope.getUser = function(){
      $.ajax('/api/user',
      {
        type: 'GET',
        success: function(u){ $scope.user = u;$scope.$apply()},
        error: function(e){$location.path('/');$scope.$apply()}
      });
    };
    var Articles = $resource('/api/document');
    $scope.articles = Articles.get();

    $scope.addToList = function(number){
      document.getElementById("selectedPanel").classList.add('popUp');
      var exist = false;
      var documents = global.getDocuments()
      for(var i=0; i<documents.length; i++){
        if(documents[i] === number)
            exist = true;
      }
      if(!exist){
        global.setDocuments(number);
        var child = '<div class="chip documentChip" id="tag' + number + '">' + number + '<i class="material-icons">close</i></div>'
        $('#selectedDocuments').append(child);
      }
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
