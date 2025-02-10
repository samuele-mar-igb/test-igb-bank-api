import axios from 'axios';
import * as utils from '../utils.js';
import dotenv from 'dotenv';
process.chdir('core api/');
dotenv.config();

const host = process.env.HOST;
const endpoint = "/v1/bank-api/webhook/event-types";  
const url = `https://${host}${endpoint}`;
const token = process.env.TOKEN;
const orgId = process.env.ORG_ID;
const keyId = process.env.KEY_ID;
const get_authorization_string = `Signature token="${token}",orgId="${orgId}",keyId="${keyId}"`;


let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: url,
  headers: { 
    'Authorization': get_authorization_string, 
    'Date': utils.getCurrentDateTime()
  }
};


axios.request(config)
.then((response) => {
    console.log(response.status, "\n", JSON.stringify(response.data));
})
.catch((error) => {
    console.log(error);
});
