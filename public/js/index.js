import '@babel/polyfill';
import {displayMap} from './mapbox'
import {login, logout} from './login';


const form = document.querySelector('.form')
const mapbox = document.getElementById('map');
const logOutButton = document.querySelector('.nav__el--logout');
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