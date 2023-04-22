class Login {
  User(){
    const user = localStorage.getItem('vtc_user');
    if(user === null){
      return false;
    }
    return user;
  }
  Check(){
    const token = localStorage.getItem('vtc_token');
    if(token === null){
      return false;
    }
    return token;
  }
  Save(auth){
    localStorage.setItem('vtc_token', auth.token);
    localStorage.setItem('vtc_user', auth.user);
  }
  Remove(){
    localStorage.removeItem('vtc_token');
    localStorage.removeItem('vtc_user');
  }
}
export default Login
