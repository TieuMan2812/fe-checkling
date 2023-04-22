import axios from 'axios'
import Login from './login'
import alert from './alert'
const Alert = new alert()
const login = new Login()
const request = function() {
  let headers = {
    'Content-Type': 'application/json',
  }
  const token = login.Check()
  if(token) headers['Authorization'] = token;
  const client = axios.create({
    baseURL: 'https://demo.wooeu.net/api',
    headers: headers
  })
  return client
}
export const onSuccess = function(response) {
  return response.data;
}
export const onError = function(error) {
    if (error.response) {
    if(error.response.status === 401){
      login.Remove()
      return this.$router.push('/login')
    }
      console.error('Status:',  error.response.status);
      console.error('Data:',    error.response.data);
      console.error('Headers:', error.response.headers);
  } else {
      console.error('Error Message:', error.message);
  }
  return Alert.Error({message: error.message ? error.message : 'Something went wrong!'})
}
export default request;
