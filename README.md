# sentisocial-backend
## Node.js backend for SentiSocial

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

Created at The University of Toronto Scarborough's Hack the Valley 2017

## Requirements

* NodeJS ^6.9.4
* NPM
* MongoDB

## Running

Before running the backend, ensure you have node + NPM installed and run:

`npm install`

After installation, edit `src/config.js` to your liking, making sure to add the
address of your MongoDB server. Then run:

`npm start`

To spin up the backend

# Tests

Jasmine unit tests are located in the `spec` directory, to run them, use:

`npm test`

# Style

This project uses the [JS standard code style](http://standardjs.com).

To run the linter, use:

`npm run lint`
