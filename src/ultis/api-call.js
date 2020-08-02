import config from '../constants/config'
import axios from 'axios'

export default function callApi(enpoint, method="get", body){
  return axios({
    method,
    url:`${config.API_URL}/${enpoint}`,
    data: body
  })
    .catch(err =>{
      console.log(err);
  })
}