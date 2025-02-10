# Testing the iGB Bank API
Testing the iFAST Global Bank (iGB) API using different programming languages:
- [x] JavaScript
- [ ] Python
- [ ] Java

## Security Concerns
All secrets in this repo are for testing purposes. A mock company has been created in the [Simulation Environment](https://igb-bank-api-simulator.ifast-aws.com/home/company/landing]).
Therefore, the private key and other secrets are not from production, but only testing / simulation.

## How To Use This Repo
To run the code in this repository, do the following:

1. Install Node.js in your Windows device -> https://www.geeksforgeeks.org/install-node-js-on-windows/.
2. Clone this repository in your preferred location.
3. In the root directory, where the `package.json` file is present, run this command in the command line:
```
npm install
``` 
4. Add an `.env` file in the `core api` folder, and write your values to the variables inside it:
```
HOST="igb-bank-api-gateway-simulator.ifast-aws.com"
ALGORITHM="rsa-sha256"
HEADERS="digest content-length token (request-target) host date content-type"
TOKEN=""
ORG_ID=""
KEY_ID=""
PRIVATE_KEY=""
```
5. That's it! Now try to run the GET and POST debug requests to check if you are authorised to make requests:
```
node '.\core api\debug\GET_debug.js'
node '.\core api\debug\POST_debug.js'
```

For more information on how to use the iGB API, please visit the [Postman Documentation website](https://api-collection.ifastgb.com/).
