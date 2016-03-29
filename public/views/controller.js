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
        if(addedUser._id){
          $scope.users.push(addedUser);
        }
        else{
          Materialize.toast('Failed to add user', 3000);
        }
      });
    }

    $scope.addToList = function(email){
      if($('#listPanel').attr('class').indexOf('floatOut') > 0){
        if(editThingId.split('-')[0] === 'u'){
          var exist = false;
          for(var i=0; i<usersList.length; i++){
            if(usersList[i] === email)
                exist = true;
          }
          if(!exist){
            usersList.push(email);
            var child = '<div class="chip documentChip" id="tag' + email + '">' + email + '<i class="material-icons">close</i></div>'
            $('#list').append(child);
          }
        }
        else {
          Materialize.toast('You should add users!', 3000);
        }
      }
      else{
        $("#selectedPanel").addClass('floatOut');
        $("#selectedPanel").removeClass('floatIn');
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
    }

}]);

Document.controller('manageDocumentsController', ['$scope', '$resource', '$http', '$timeout', '$location',
  function($scope, $resource, $http, $timeout, $location){
    $scope.typeSelected = false;
    $scope.firstTime = true;
    $scope.getUser = function(){
      $.ajax('/api/user',
      {
        type: 'GET',
        success: function(u){ $scope.user = u;$scope.$apply();},
        error: function(e){$location.path('/');$scope.$apply();}
      });
    };
    var Articles = $resource('/api/documents/order=relevance&page=1&conditions[term]=&conditions[type]=');
    $scope.articles = Articles.get(function(){
    });


    $scope.addToList = function(number){
      if($('#listPanel').attr('class').indexOf('floatOut') > 0){
        if(editThingId.split('-')[0] === 'd'){
          var exist = false;
          for(var i=0; i<documentsList.length; i++){
            if(documentsList[i] === number)
                exist = true;
          }
          if(!exist){
            documentsList.push(number);
            var child = '<div class="chip documentChip" id="tag' + number + '">' + number + '<i class="material-icons">close</i></div>'
            $('#list').append(child);
          }
        }
        else {
          Materialize.toast('You should add documents!', 3000);
        }
      }
      else{
        $("#selectedPanel").addClass('floatOut');
        $("#selectedPanel").removeClass('floatIn');
        var exist = false;
        for(var i=0; i<documentsList.length; i++){
          if(documentsList[i] === number)
              exist = true;
        }
        if(!exist){
          documentsList.push(number);
          var child = '<div class="chip documentChip" id="tag' + number + '">' + number + '<i class="material-icons">close</i></div>'
          $('#selectedDocuments').append(child);
        }
      }
    };

    $scope.getDocuments = function(term, types){
      var typeString = '';
      $.each(types, function(index, value){
        typeString = typeString + '&conditions[type]=' + value;
      });
      var Document = $resource('/api/documents/order=relevance&page=1&conditions[term]=' + term + typeString);
      $scope.articles = Document.get();
    };

    $scope.getMore = function(url){
      var more = $resource('/api/documents/' + url);
      var moreDocuments = more.get(
        function(){
          $scope.articles.results = $scope.articles.results.concat(moreDocuments.results);
          $scope.articles.next_page_url = moreDocuments.next_page_url;
        });
    };

    $(window).scroll(function(){
      if($(window).scrollTop() + $(window).height() > $(document).height() - 50){
        $scope.getMore($scope.articles.next_page_url.split('?')[1]);
      }
    });

    $('#search').on('click', function(e){
      $('#selectType').animate({top:'60px',opacity:'1'});
      $scope.typeSelected = true;
      // $('#searchBtn').animate({opacity:'1'});
    });

    $('#search').on('keypress', function(e){
      if(e.which === 13){
        $scope.getDocuments($('#search').val(), $('#typeSelector').val());
      }
    });

    $('#selectType').change(function(){
       $('#typeSelector').val();
      $scope.typeSelected = true;
    });

    $(document).on('click', function(e){
      var target = e.target;
      if(!$(target).is('#selectType') && !$(target).is('#search')){
        $('#selectType').animate({top:'20px',opacity:'0'});
        if($scope.typeSelected){
          $scope.getDocuments($('#search').val(), $('#typeSelector').val());
          $scope.typeSelected = false;
          $('#typeSelector').val('');
          $('select').material_select();
        }
      }
    });
  }]).directive('myRepeatDirective2', function() {
    return function($scope) {
      if ($scope.$last){
        var begin = $scope.articles.results.length - 21;
        var count = 0;
        $('.documents').each(function(index, value){
          if(index>begin)
          setTimeout(function(){$('.documents').eq(index).addClass('show')}, count++ * 100);
        });
      }
    };
  });

Document.controller('manageListsController', ['$scope', '$resource', '$location',
  function($scope, $resource, $location){
    var list = $resource('/api/documentsList');
    list.query(function(result){
      $scope.lists = result;
      $.each(result, function(index, value){
        $scope.lists[index].documentsList = value.documentsList.split(',');
        $scope.lists[index].documentsList = $scope.lists[index].documentsList.filter(String);
        $scope.lists[index].usersList = value.usersList.split(',');
        $scope.lists[index].usersList = $scope.lists[index].usersList.filter(String);
      });
    });
    $scope.getUser = function(){
      $.ajax('/api/user',
      {
        type: 'GET',
        success: function(u){ $scope.user = u;$scope.$apply()},
        error: function(e){$location.path('/');$scope.$apply()}
      });
    };
    $scope.addMore = function(id){
      editThingId = id;
      console.log(id);
      if(id.split('-')[0] === 'u'){
        $location.path('/manageUsers');
        $("#list").empty();
        $("#listPanel").children('p').empty();
        $("#listPanel").children('p').append("Click '+' to add users");
      }
      if(id.split('-')[0] === 'd'){
        $location.path('/manageDocuments');
        $("#list").empty();
        $("#listPanel").children('p').empty();
        $("#listPanel").children('p').append("Click '+' to add documents");
      }
      $("#listPanel").addClass('floatOut');
      $("#listPanel").removeClass('floatIn');
    };
    $scope.deleteList = function(id){
      var list2 = $resource('/api/documentsList/'+id);
      list2.delete({listId: id}, function(result){
        console.log(result);
        if(result){
          $( "#td-" + id ).fadeOut("fast");
        }
      });
    };
  }
]);
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

Document.controller('viewDocumentsController', ['$scope', '$resource', '$location', '$timeout', '$filter',
function($scope, $resource, $location, $timeout, $filter){
  $scope.getDocuments = function(emailAddress){
    var Documents = $resource('/api/users/' + emailAddress + '/documents');
    $scope.documents = Documents.get(function(){
      var hasRank = false;
      $scope.documents.results.forEach(function(r, index){
        hasRank = false;
        $scope.user.rankedDocuments.forEach(function(j){
          if(r.document_number === j.documentNumber){
            $scope.documents.results[index].rank = 'ranked';
            hasRank = true;
          }
        });
        if(!hasRank){
          $scope.documents.results[index].rank = 'unrank';
        }
      });
    });
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

    $('#search').on('click', function(e){
      $('#selectType2').animate({top:'60px',opacity:'1'});
    });

    $('#selectType2').change(function(){
       if($('#typeSelector').val() === 'Reviewed'){
         $scope.selected = 'ranked';
         $scope.$apply();
       }
       else if($('#typeSelector').val() === 'NotReviewed'){
         $scope.selected = 'unrank';
         $scope.$apply();
       }
       else{
         $scope.selected = '';
         $scope.$apply();
       }
    });

    $(document).on('click', function(e){
      var target = e.target;
      if(!$(target).is('#selectType') && !$(target).is('#search')){
        $('#selectType2').animate({top:'20px',opacity:'0'});
        $('#typeSelector').val('');
        $('select').material_select();
      }
    });
  }
}]).directive('myRepeatDirective', function() {
  return function($scope) {
    if ($scope.$last){
      $scope.initRank();
    }
    $scope.orderProp = '';
    var count = 0;
    $('.documents').each(function(index, value){
      setTimeout(function(){$('.documents').eq(index).addClass('show')}, count++ * 100);
    });
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
        if($scope.user.profile.phones < 1){
          $scope.user.profile.phones = '';
        }
        console.log($scope.user);
        $scope.$apply();
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
          $scope.getUser();
        }
      });
    }
    $scope.addPhone = function(){
      var content =
          '  <div class="input-field col s12">'+
'              <input type="text" class="phones"">'+
'              <label>Phone Number</label>'+
            '  <p class="deletePhone"><i class="fa fa-times delete"></i></p>'+
'            </div>';
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
