var addListResult = function(result){
  if(result){
    Materialize.toast('Success!', 3000);
  }
  else {
    Materialize.toast('Failed!', 3000);
  }
}

var createUser = function(){
  body = {
    firstName: 'yifan',
    lastName: 'gu',
    userName: 'yifan',
    emailAddress: '594487125@qq.com',
    password: 'gu',
    userType: 'user',
    avatarImage: '',
    favoriteThings:{ thing1: 'swim', thing2: 'music' }
  };
  url = '/api/users';

  $.ajax(url, {type: 'POST', data: body});
}

var createDocuments = function(){
  var usersL ='';
  var documentsL = '';
  $('.userChip').each(function(){
    usersL = usersL + $( this ).text().split('close')[0] + ',';
  });
  $('.documentChip').each(function(){
    documentsL = documentsL + $( this ).text().split('close')[0] + ',';
  });
  // var usersL = usersList.toString();
  // var documentsL = documentsList.toString();
  // url = '/api/documents';
  // body = {usersList: usersL, documentsList: documentsL};
  // $.ajax(url, {type: 'POST', data:body, success: function(result){addListResult(result)}});
  //
  // usersList = [];
  // documentsList = [];
  // $("#selectedPanel").addClass('floatIn');
  // $("#selectedPanel").removeClass('floatOut');
  // setTimeout(function(){$("#selectedDocuments").empty();$("#selectedUsers").empty();}, 1500);

  // var usersL = usersList.toString();
  // var documentsL = documentsList.toString();
  url = '/api/documents';
  body = {usersList: usersL, documentsList: documentsL};
  $.ajax(url, {type: 'POST', data:body, success: function(result){addListResult(result)}});

  usersList = [];
  documentsList = [];
  $("#selectedPanel").addClass('floatIn');
  $("#selectedPanel").removeClass('floatOut');
  setTimeout(function(){$("#selectedDocuments").empty();$("#selectedUsers").empty();}, 1500);
}

var closePanel = function(){
  usersList = [];
  documentsList = [];
  $("#selectedPanel").addClass('floatIn');
  $("#selectedPanel").removeClass('floatOut');
  setTimeout(function(){$("#selectedDocuments").empty();$("#selectedUsers").empty();}, 1500);
}

var addMoreDone = function(){
  // alert(editThingId);
  // $('.documentChip').each(function(){
  //   documentsL = documentsL + $( this ).text().split('close')[0] + ',';
  // });
  // console.log($('#'+editThingId).children());
  // console.log($('.documentChip'));
  usersList = [];
  documentsList = [];
  $("#listPanel").addClass('floatIn');
  $("#listPanel").removeClass('floatOut');
  $('.documentChip').each(function(){
    var thingToAdd = $(this).text().split('close')[0];
    var alreadyExists = false;
    $('#'+editThingId).children().each(function(){
      if($(this).text().split('close')[0] === thingToAdd){
        alreadyExists = true;
      }
    });
    if(!alreadyExists){
      console.log(thingToAdd);
      var child = '<div class="chip">' + thingToAdd + '<i class="material-icons">close</i></div>'
      $('#' + editThingId).append(child);
    }
  });
  setTimeout(function(){$("#list").empty()}, 1500);
}

var closePanel2 = function(){
  usersList = [];
  documentsList = [];
  $("#listPanel").addClass('floatIn');
  $("#listPanel").removeClass('floatOut');
  setTimeout(function(){$("#list").empty()}, 1500);
}
//
// var showDocumentsPanel = function(){
//   $('#documentsPanel').animate({left:'0px'}, 1000 ,"swing");
// }
