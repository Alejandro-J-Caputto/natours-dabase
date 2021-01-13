// import {axios} from '../../node_modules/axios/index'
const login = async (email, password) => {
  try {
    const resolve = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if(resolve.data.status === 'success') {
      alert('Logged in succesfully');
      window.setTimeout(()=> {
        location.assign('/');
      }, 1500)
    }
    console.log(resolve.data);

  } catch (err) {
    alert(err.response.data.message);
  }
}


document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});