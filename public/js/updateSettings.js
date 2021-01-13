import axios from 'axios';

import {showAlert} from './alert'

export const updateData = async (data, type) => {

  try {
    const url = type === 'password' ? 'http://localhost:3000/api/v1/users/resetMyPassword' : 'http://localhost:3000/api/v1/users/updateMe';
    const result = await axios({
      method: 'PATCH',
      url,
      data
    })
    if(result.data.status === 'success') {
      showAlert('success', type.toUpperCase() + ' Data updated succesfully');
    }
  } catch(err) {
    showAlert('error', err.response.data.message)
  }

}