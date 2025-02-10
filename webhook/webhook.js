// Tunnel events that arrive to a public webhook URL: https://{unique_subdomain}.ngrok-free.app/webhook 
// to a local webhook endpoint: http://localhost:3000/webhook

import express from 'express';
import bodyParser from 'body-parser';
import { jsonToCsv, downloadCsv, appendRow } from './saveToCsv.js';
import * as utils from '../core api/utils.js';
import dotenv from 'dotenv';
process.chdir('core api/');
dotenv.config();


const app = express();
const port = 3000;
const wantToSaveToCSV = true;


app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const webhookData = req.body;
    console.log('Event received:\n', webhookData);
    
    if (wantToSaveToCSV) {
        const csvData = jsonToCsv(webhookData);

        if (csvData[0] == 'COMPLETED') {
            appendRow(csvData[1], 'COMPLETED')
        };
        if (csvData[0] == 'PROCESSING') {
            appendRow(csvData[1], 'PROCESSING')
        };
        if (csvData[0] == 'REJECTED') {
            appendRow(csvData[1], 'REJECTED')
        }; 

        // downloadCsv(csvData);
    }

    res.status(200).send('Event received');
});


app.listen(port, () => {
    console.log(`Webhook listener running on port ${port}`);
});


const ngrokTunnelUrl = await utils.connectNgrokTunnel(port, process.env.NGROK_AUTHTOKEN);
console.log(ngrokTunnelUrl);
