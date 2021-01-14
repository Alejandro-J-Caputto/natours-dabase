import '@babel/polyfill';
import {displayMap} from './mapbox'
import {login, logout} from './login';
import {updateData} from './updateSettings';

const form = document.querySelector('.form')
const mapbox = document.getElementById('map');
const logOutButton = document.querySelector('.nav__el--logout');


const usertDataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-settings');
if(mapbox) {

  const locations = JSON.parse(document.getElementById('map').dataset.locations);
  
  displayMap(locations);
}
if(form){

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if(logOutButton) {
  logOutButton.addEventListener('click', logout);
}

if(usertDataForm) {
  usertDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    // const name = document.getElementById('name').value
    // const email = document.getElementById('email').value;
    updateData(form, 'data');
  })
}
if(passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateData({passwordCurrent, password, passwordConfirm}, 'password');

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

  })
}

