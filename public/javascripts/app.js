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
