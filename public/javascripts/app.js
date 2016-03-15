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
