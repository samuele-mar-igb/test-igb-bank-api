import fs from 'fs';

const completedCsvPath = '../files/CSVs/completed_payments.csv';
const processingCsvPath = '../files/CSVs/processing_payments.csv';
const rejectedCsvPath = '../files/CSVs/rejected_payments.csv';


export function jsonToCsv(jsonData) {

    // const keys = Object.keys(jsonData).slice(0,-1);
    const rows = Object.values(jsonData).slice(0,-1);

    const data = jsonData['data'];
    let dataKeys = Object.keys(data);
    let dataRows = Object.values(data);
    
    let paymentStatus = 'none';
    if (dataKeys.includes('status')) {
        paymentStatus = data['status']; 
    };
    if (dataKeys.includes('paymentDetails')) {
        paymentStatus = data['paymentDetails']['status']; 
    };


    // let mergedKeys = keys.concat(dataKeys);
    let mergedRows = rows.concat(dataRows);

    if (dataKeys.includes('paymentDetails')) {

        const paymentDetails = data['paymentDetails'];
        
        // dataKeys = dataKeys.slice(0, -1);
        dataRows = dataRows.slice(0, -1);
        
        // const paymentDetailsKeys = Object.keys(paymentDetails);
        const paymentDetailsRows = Object.values(paymentDetails);

        // mergedKeys = mergedKeys.concat(paymentDetailsKeys);
        mergedRows = mergedRows.concat(paymentDetailsRows);
    }

    const out = [paymentStatus, mergedRows.join(',')];
    return out;   // [mergedKeys.join(','), mergedRows.join(',')].join('\n')
}


export function downloadCsv(csvData) {
    fs.writeFile(csvPath, csvData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing CSV file:', err);
        } else {
            console.log('CSV file successfully created as output.csv');
        }
    });
}


export function appendRow(row, status) {

    let csvPath = './output.csv'    // default

    if (status == 'COMPLETED') {
        csvPath = completedCsvPath;
    };
    if (status == 'PROCESSING') {
        csvPath = processingCsvPath;
    };
    if (status == 'REJECTED') {
        csvPath = rejectedCsvPath;
    }; 

    fs.appendFile(csvPath, `\n${row}`, (err) => {
        if (err) {
            console.error('Error appending to file:', err);
        } else {
            console.log('Row appended successfully!');
        }
    });
}