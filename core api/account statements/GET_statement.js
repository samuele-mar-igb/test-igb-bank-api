import axios from 'axios';
import * as utils from '../utils.js';
import dotenv from 'dotenv';
process.chdir('core api/');
dotenv.config();


const host = process.env.HOST;
const endpoint = "/v1/bank-api/statement/";  
const statementId = "38642";    // make sure to change this value with an existing one!!!
const url = `https://${host}${endpoint}?statementId=${statementId}`;

const token = process.env.TOKEN;
const orgId = process.env.ORG_ID;
const keyId = process.env.KEY_ID;
const get_authorization_string = `Signature token="${token}",orgId="${orgId}",keyId="${keyId}"`;


let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: url,
  headers: { 
    'Content-Type': 'application/pdf',
    'Authorization': get_authorization_string, 
    'Date': utils.getCurrentDateTime()
  },
  responseType: 'arraybuffer'
};


axios.request(config)
.then((response) => {
    console.log(response.status);
    utils.downloadPDF('statement', response.data);
})
.catch((error) => {
    console.log(error);
});
