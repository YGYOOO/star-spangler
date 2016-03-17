var Document = angular.module('Document', ['ngRoute', 'ngResource']);

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

Document.controller('viewDocumentsController', ['$scope', '$resource', '$location', '$timeout',
function($scope, $resource, $location, $timeout){
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
    User.update({emailAddress: $scope.user.emailAddress}, body, function(result, headers){
      if (result) {
        // Materialize.toast('Success!', 3000);
      }
      else {
        Materialize.toast('Failed!', 3000);
      }
  });
  }

  $scope.initRank = function(){
    $timeout(
      function(){
        $.each($scope.user.rankedDocuments, function(index, value){
          console.log(value.documentNumber + ' ' + value.rank);
          $('#rate_' + value.documentNumber).addClass('rank' + value.rank);
        });
        $(".rank1").rateYo({
          rating: 1,
          fullStar: true,
          starWidth: "22px"
        });
        $(".rank2").rateYo({
          rating: 2,
          fullStar: true,
          starWidth: "22px"
        });
        $(".rank3").rateYo({
          rating: 3,
          fullStar: true,
          starWidth: "22px"
        });
        $(".rank4").rateYo({
          rating: 4,
          fullStar: true,
          starWidth: "22px"
        });
        $(".rank5").rateYo({
          rating: 5,
          fullStar: true,
          starWidth: "22px"
        });
        $(".rateYo").rateYo({
          rating: 0,
          fullStar: true,
          starWidth: "22px",

        }).on("rateyo.set", function (event, data) {
          $scope.userRank($(event.target).attr('id').split('_')[1], data.rating);
        });
      },
    500);
  }
}]).directive('myRepeatDirective', function() {
  return function($scope) {
    if ($scope.$last){
      $scope.initRank();
    }
  };
});

Document.controller('editProfileController',['$scope', '$resource', '$location',
  function($scope, $resource, $location){
    $("#uploadPhoto").change(function(){
      $scope.saveAvatar();
    });
    $scope.getUser = function(){
      $.ajax('/api/user',
      {
        type: 'GET',
        success: function(u){ $scope.user = u;$scope.$apply();
        $('#favoriteThings').materialtags('add', u.profile.favoriteThings.toString());
        },
        error: function(e){$location.path('/');$scope.$apply()}
      });
    };
    $scope.changeAvatar = function(){
      $("#uploadPhoto").click();
    };
    $scope.saveAvatar = function(){
      var formData = new FormData();
      if(!$('#uploadPhoto').val()) return;
      formData.append('tags', '[]');
      formData.append('avatar', $('#uploadPhoto')[0].files[0]);

      $.ajax({
        url: '/api/users/' + $scope.user.emailAddress + '/avatar',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(result){

        }
      });
    }
    $scope.addPhone = function(){
      var content = '<div class="row">'+
          '  <div class="input-field col s12">'+
'              <input type="text" class="phones"">'+
'              <label>Phone Number</label>'+
            '  <p class="deletePhone"><i class="fa fa-times delete"></i></p>'+
'            </div>'+
          '</div>';
      $('#addPhone').before(content);
    };

    $scope.updateProfile = function(){
      var User = $resource('/api/users/:emailAddress/profile', null,
        {
            'update': { method:'PUT' }
        });
      var phones = [];

      $(".phones").each(function(){
        phones.push($(this).val());
      });
      var favoriteThings = $("#favoriteThings").val().split(',');
      var body = {
        emailAddress: $("#emailAddress").val(),
        userName: $("#userName").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        phones: phones,
        favoriteThings: favoriteThings,
      };
      User.update({emailAddress: $scope.user.emailAddress} ,body, function(result, headers){
        console.log(result[0]);
        if(result[0] === '1'){
          Materialize.toast('Success!', 3000);
        }
        else if (result[0] === '2') {
          Materialize.toast('The email is already registered by others', 3000);
        }
        else{
          Materialize.toast('Oops..Failed to update your profile', 3000);
        }
      });
    };
}]);
