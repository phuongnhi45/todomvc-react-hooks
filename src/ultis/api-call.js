import * as config from '../constants/config'
import axios from 'axios'

export default function callApi(endpoint, method, body){
  return axios({
    method,
    url:`${config.API_URL}/${endpoint}`,
    data: body
  })
    .catch(err =>{
      console.log(err);
  })
}