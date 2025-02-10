import axios from 'axios';
import * as utils from '../utils.js';
import dotenv from 'dotenv';
process.chdir('core api/');
dotenv.config();

const host = process.env.HOST;
const endpoint = "/v1/bank-api/payment";
const url = `https://${host}${endpoint}`;
const token = process.env.TOKEN;
const orgId = process.env.ORG_ID;
const keyId = process.env.KEY_ID;
const algorithm = process.env.ALGORITHM;
const headers = process.env.HEADERS;
const private_key = process.env.PRIVATE_KEY;

const get_authorization = `Signature token="${token}",orgId="${orgId}",keyId="${keyId}"`;
const random_guid = utils.generateRandomUUID();
const random_guid2 = utils.generateRandomUUID();
const current_datetime = utils.getCurrentDateTimeWithFormat("ddd, DD MMM YYYY h:mm:ss ZZ");


let payload = JSON.stringify({
    "id": random_guid,
    "organisationId": orgId,
    "data": {
        "referenceNo": random_guid2,
        "amount": "231.00",
        "currency": "EUR",
        "paymentPurpose": "EDU",
        "paymentCharges": "SHA",
        "beneficiaryParty": {
            "accountName": "Mrs Receiver Name",
            "accountNumber": "HR1210010051863000160",
            "accountNumberCode": "IBAN",
            "accountWith": {
                "bankId": "PBZGHR2XXXX",
                "bankIdCode": "SWBIC",
                "bankAddress": [
                    "1428",
                    "Elm Street"
                ],
                "bankCountry": "HR"
            },
            "address": [
                "123 Sesame Street",
                "Manhattan"
            ],
            "country": "GB"
        },
        "debtorParty": {
            "accountNumber": "00000001",
            "accountNumberCode": "BBAN",
            "accountCurrency": "EUR",
            "accountWith": {
                "bankId": "043630",
                "bankIdCode": "GBDSC"
            }
        },
        "ultimateCreditorParty": {
            "individual": {
                "name": "Mr Ultimate Cred",
                "identification": "ABC123456789",
                "dateOfBirth": "1998-08-15",
                "cityOfBirth": "Great Britain",
                "countryOfBirth": "GB",
                "address": [
                    "1428",
                    "Elm Street"
                ],
                "buildingName": "1428",
                "postCode": "123456",
                "townName": "Elm Street",
                "addressCountry": "GB",
                "countryResidence": "GB"
            }
        },
        "ultimateDebtorParty": {
            "individual": {
                "name": "Mr Ultimate Debt",
                "identification": "ABC123456789",
                "dateOfBirth": "1998-08-15",
                "cityOfBirth": "Great Britain",
                "countryOfBirth": "GB",
                "address": [
                    "1428",
                    "Elm Street"
                ],
                "buildingName": "1428",
                "postCode": "123456",
                "townName": "Elm Street",
                "addressCountry": "GB",
                "countryResidence": "GB"
            }
        },
        "correspondentBank": {
            "accountNumber": "BE68539007547034",
            "accountNumberCode": "IBAN",
            "accountWith": {
                "bankName": "EUROCLEAR BANK S.A / N.V",
                "bankId": "MGTCBEBEXXX",
                "bankIdCode": "SWBIC",
                "bankAddress": [
                    "BOULEVARD DU ROI ALBERT",
                    "II 1"
                ],
                "bankCountry": "BE"
            }
        },
        "reference": "My Reference",
        "remittance": [
            "My Remmitance 1",
            "My Remmitance 2",
            "My Remmitance 3",
            "My Remmitance 4"
        ],
        "paymentScheme": "INTERNATIONAL"
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

