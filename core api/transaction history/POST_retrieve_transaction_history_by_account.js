import axios from 'axios';
import * as utils from '../utils.js';
import dotenv from 'dotenv';
process.chdir('core api/');
dotenv.config();

const host = process.env.HOST;
const endpoint = "/v1/bank-api/transaction-history-account";
const url = `https://${host}${endpoint}`;
const token = process.env.TOKEN;
const orgId = process.env.ORG_ID;
const keyId = process.env.KEY_ID;
const algorithm = process.env.ALGORITHM;
const headers = process.env.HEADERS;
const private_key = process.env.PRIVATE_KEY;

const get_authorization = `Signature token="${token}",orgId="${orgId}",keyId="${keyId}"`;
const random_guid = utils.generateRandomUUID();
const current_datetime = utils.getCurrentDateTimeWithFormat("ddd, DD MMM YYYY h:mm:ss ZZ");


let payload = JSON.stringify({
  "id": random_guid,
  "organisationId": orgId,
  "data": {
      "bookingDateFrom": "2024-12-01",
      "bookingDateTo": "2024-12-02",
      "bankAccountNo": "00000069",
      "currency": [
          "GBP",
          "USD",
          "EUR",
          "HKD",
          "SGD",
          "CNY",
          "AED",
          "JPY"
      ],
      "page": 0,
      "size": 10
  }
});

const digest = utils.generateDigest(payload);

// Generate signature by using the following data
const signature_data = {
  "private_key": private_key,                   // Client's private key
  "digest": digest,                             // Digest
  "payload": payload,                           // POST request payload 
  "token": token,                               // API token
  "endpoint": endpoint,                         // API endpoint to which the request is being sent 
  "host": host,                                 // API host domain
  "current_datetime": current_datetime          // Current date and time
}

const signature_json = utils.generateSignatureJson(signature_data);
const signature = signature_json["base64_signature"];
const signature_debug = signature_json["base64_signature_debug"];

const post_authorization = get_authorization + `,algorithm="${algorithm}",headers="${headers}",signature="${signature}"`;


let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: url,
  headers: { 
    'Authorization': post_authorization, 
    'Content-Type': 'application/json', 
    'Date': current_datetime, 
    'Digest': digest, 
    'Signature-Debug': signature_debug
  },
  data : payload
};

axios.request(config)
.then((response) => {
  console.log(response.status, "\n", JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});

