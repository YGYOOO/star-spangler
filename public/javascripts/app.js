function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

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
  if(!usersL){
    window.location.replace('#/manageUsers');
    Materialize.toast("You should add some users", 3000);
  }
  else if(!documentsL){
    window.location.replace('#/manageDocuments');
    Materialize.toast("You should add some documents", 3000);
  }
  else {
    url = '/api/documentsList';
    body = {usersList: usersL, documentsList: documentsL};
    $.ajax(url, {type: 'POST', data:body, success: function(result){addListResult(result)}});

    usersList = [];
    documentsList = [];
    $("#selectedPanel").addClass('floatIn');
    $("#selectedPanel").removeClass('floatOut');
    setTimeout(function(){$("#selectedDocuments").empty();$("#selectedUsers").empty();}, 1500);
  }
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
}

var closePanel = function(){
  usersList = [];
  documentsList = [];
  $("#selectedPanel").addClass('floatIn');
  $("#selectedPanel").removeClass('floatOut');
  setTimeout(function(){$("#selectedDocuments").empty();$("#selectedUsers").empty();}, 1500);
}

var addMoreDone = function(){
  if(window.location.href.split('#')[1] !== '/manageLists'){
    document.cookie = 'editThingId=' + editThingId;
    window.location.replace('#/manageLists');
    Materialize.toast("Please click ' √' again", 3000);
  }
  else {
    usersList = [];
    documentsList = [];
    editThingId = getCookie('editThingId') || editThingId;
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
        var child = '<div class="chip">' + thingToAdd + '<i class="material-icons">close</i></div>'
        $('#' + editThingId).append(child);
      }
    });

    $('#u-' + editThingId.split('-')[1]).children().each(function(){
      usersList = usersList + $(this).text().split('close')[0] + ',';
    });
    $('#d-' + editThingId.split('-')[1]).children().each(function(){
      documentsList = documentsList + $(this).text().split('close')[0] + ',';
    });

    console.log(usersList + '\n' + documentsList);
    $.ajax(
      '/api/documentsList/' + editThingId.split('-')[1],
      {
        type: 'PUT',
        data: {usersList: usersList, documentsList: documentsList},
        success: function(){}
      }
    );
    setTimeout(function(){$("#list").empty()}, 1500);
  }
  editThingId = [];
  usersList = [];
  documentsList = [];
}

var deleteOne = function(t){
  var thingId = $(t).parent().parent().attr('id');
  var users = '';
  var documents = '';
  $('#u-' + thingId.split('-')[1]).children().each(function(){
    users = users + $(this).text().split('close')[0] + ',';
  });
  $('#d-' + thingId.split('-')[1]).children().each(function(){
    documents = documents + $(this).text().split('close')[0] + ',';
  });

  if(thingId.split('-')[0] === 'u'){
    users = users.replace($(t).parent().text().split('close')[0] + ',' , '');
  }
  else {
    documents = documents.replace($(t).parent().text().split('close')[0] + ',' , '');
  }

  $.ajax(
    '/api/documentsList/' + thingId.split('-')[1],
    {
      type: 'PUT',
      data: {usersList: users, documentsList: documents},
    }
  );
}

var closePanel2 = function(){
  usersList = [];
  documentsList = [];
  $("#listPanel").addClass('floatIn');
  $("#listPanel").removeClass('floatOut');
  setTimeout(function(){$("#list").empty()}, 1500);
}

var logout = function(){
  $.ajax(
    '/api/logout',
    {
      type: 'GET',
      success: function(){window.location = "/";}
    }
  );
}
