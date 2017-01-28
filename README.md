# sentisocial-backend
## Node.js backend for SentiSocial

[![Travis](https://img.shields.io/travis/SentiSocial/sentisocial-backend.svg)](https://travis-ci.org/SentiSocial/sentisocial-backend)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

Created at The University of Toronto Scarborough's Hack the Valley 2017

SentiSocial is a Twitter based news aggregation and sentiment analysis tool.
This repository contains the SentiSocial backend, which queries the Twitter API
for current trends, and aggregates news and popular tweets for those trends
using the [News API](https://newsapi.org/) and the Twitter API. Sentiment
analysis is performed on tweets related to each trend using the [NPM sentiment
package](https://www.npmjs.com/package/sentiment). All this information is then
exposed via a REST API created with express.js.

The SentiSocial frontend can be found [here](github.com/SentiSocial/sentisocial-frontend)

The API is documented in api-doc.md.

## Requirements

* NodeJS ^6.9.4
* NPM
* MongoDB

## Running

Before running the backend, ensure you have node + NPM installed and run:

`npm install`

After installation, edit `src/config.js` to your liking, making sure to add the
address of your MongoDB server, then run:

`npm start`

To spin up the backend

# Tests

Jasmine tests are located in the `spec` directory, to run them, use:

`npm test`

# Style

This project uses the [JS standard code style](http://standardjs.com).

To run the linter, use:

`npm run lint`
