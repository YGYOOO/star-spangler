// $.bridget( 'masonry', masonry );

var Document = angular.module('Document', ['ngRoute', 'ngResource']);

// Document.factory('userRank', ['$resource',
//     function($resource) {
//       return $resource('/api/users/:emailAddress/rankedDocuments', null,
//       {
//         'update': { method:'PUT' }
//       });
//     }
//   ]);

Document.controller('documentsController', ['$scope', '$resource',
  function($scope, $resource){
    var Articles = $resource('/api/document');

    $scope.articles = Articles.query();
  }
]);

Document.controller('manageUsersController', ['$scope', '$resource', '$location',
  function($scope, $resource, $location){
    var Users = $resource('/api/users');
    var useUpdate = $resource
    $scope.users = Users.query();

    var User = $resource('/api/users/:emailAddress/type', null,
        {
            'update': { method:'PUT' }
        });

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
        body= {userType: 'admin'};
      else
        body= {userType: 'user'};
      User.update({emailAddress: emailAddress}, body);
      }

    $scope.addUser = function(){
      var body = {emailAddress: $scope.emailAddress}
      Users.save(body, function(addedUser, responseHeaders){
        $scope.users.push(addedUser);
      });
    }

    $scope.addToList = function(email){
      document.getElementById("selectedPanel").classList.add('floatOut');
      document.getElementById("selectedPanel").classList.remove('floatIn');
      var exist = false;
      // var users = global.getUsers();
      for(var i=0; i<usersList.length; i++){
        if(usersList[i] === email)
          exist = true;
      }
      if(!exist){
        // global.setUsers(global.setUsers(email));
        usersList.push(email);
        var child = '<div class="chip userChip" id="tag' + email + '">' + email + '<i class="material-icons">close</i></div>'
        $('#selectedUsers').append(child);
      }
    }

}]);

Document.controller('manageDocumentsController', ['$scope', '$resource',
  function($scope, $resource){
    $scope.getUser = function(){
      $.ajax('/api/user',
      {
        type: 'GET',
        success: function(u){ $scope.user = u;$scope.$apply()},
        error: function(e){$location.path('/');$scope.$apply()}
      });
    };
    var Articles = $resource('/api/documents');
    $scope.articles = Articles.get();

    $scope.addToList = function(number){
      document.getElementById("selectedPanel").classList.add('floatOut');
      document.getElementById("selectedPanel").classList.remove('floatIn');
      var exist = false;
      // var documents = global.getDocuments()
      for(var i=0; i<documentsList.length; i++){
        if(documentsList[i] === number)
            exist = true;
      }
      if(!exist){
        // global.setDocuments(number);
        documentsList.push(number);
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
          $location.path('/viewDocuments');
        }
      });
    };
  }
]);

Document.controller('viewDocumentsController', ['$scope', '$resource', '$location',
function($scope, $resource, $location){
  $scope.getDocuments = function(emailAddress){
    var Documents = $resource('/api/documents/' + emailAddress);
    $scope.documents = Documents.get();
  };
  $scope.getUser = function(){
    $.ajax('/api/user',
    {
      type: 'GET',
      success: function(u){ $scope.user = u;$scope.$apply();$scope.getDocuments(u.emailAddress)},
      error: function(e){$location.path('/');$scope.$apply()}
    });
  }
  $scope.userRank = function(dNumber, rank){
    var User = $resource('/api/users/:emailAddress/rankedDocuments', null,
      {
          'update': { method:'PUT' }
      });
    var body = {dNumber: dNumber, rank: rank};
    User.update({emailAddress: $scope.user.emailAddress}, body);
  }
}]).directive('myRepeatDirective', function() {
  return function($scope) {
    if ($scope.$last){
      $('.star-rating').rating(function(vote, event){
        var className = $(event.target).parent().parent().attr('class');
        // $scope.userRank(className.split(' ')[1], vote);
      });
    }
  };
});
