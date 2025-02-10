import { v4 } from 'uuid';
import moment from 'moment';
import crypto from 'crypto-js';
import forge from 'node-forge';
import fs from 'fs';
import ngrok from '@ngrok/ngrok';


export function getCurrentDateTime() {
    const currentDate = new Date();
    const rfc2822Date = currentDate.toUTCString();
    return rfc2822Date;
};


export function getCurrentDateTimeWithFormat(format) {
    return moment().format(format);
};


export function generateRandomUUID() {
    return v4();
};


export function generateDigest(data) {
    const hashed_digest = crypto.SHA256(data);
    return hashed_digest.toString(crypto.enc.Base64);
};


export function generateSignatureJson(signature_data) {

    let signature_string = [
        { key: "digest", value: `SHA-256=${signature_data["digest"]}` }, 
        { key: "content-length", value: signature_data["payload"].length },
        { key: "token", value: signature_data["token"] },
        { key: "(request-target)", value: `post ${signature_data["endpoint"]}` },
        { key: "host", value: signature_data["host"] },
        { key: "date", value: signature_data["current_datetime"] },
        { key: "content-type", value: 'application/json' },
    ].filter(e => Boolean(e.value));
      
    signature_string = signature_string.map(e => `${e.key}: ${e.value}`).join("\n");
   
    const rsaKey = forge.pki.privateKeyFromPem(signature_data["private_key"]);
    const sha256 = forge.md.sha256.create();
    sha256.update(signature_string, 'utf8');
    const hashed_signature = rsaKey.sign(sha256);
    
    if (signature_data["endpoint"] == "/v1/igb/debug/signing") {          // if is debug request
        const base64_signature = forge.util.encode64(hashed_signature);
        const signature_debug_parsed = crypto.enc.Utf8.parse(signature_string);
        const base64_signature_debug = crypto.enc.Base64.stringify(signature_debug_parsed);
        return {
            "base64_signature": base64_signature, 
            "base64_signature_debug": base64_signature_debug
        };
    } else {
        const base64_signature = forge.util.encode64(hashed_signature);
        return {
            "base64_signature": base64_signature
        };
    } 
};


export function downloadPDF(filename, responseData) {
    try {
        fs.writeFileSync(`../files/PDFs/${filename}.pdf`, responseData, 'binary');
        console.log('PDF downloaded successfully');
    } catch (error) {
        console.error('There was an error downloading the PDF:', error);
    }
};


export async function connectNgrokTunnel(port, token) {
    const listener = await ngrok.forward({addr: port, authtoken: token});
    return listener.url();
}