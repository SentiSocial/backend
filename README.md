<p align="center">
<img height=250 width=250 src="logo.png">
</p>
<h1 align="center">SentiSocial-Backend</h1>

<p align="center">
<a href="https://travis-ci.org/SentiSocial/sentisocial-backend"><img alt="Travis" src="https://img.shields.io/travis/SentiSocial/sentisocial-backend.svg"></a>
<a href='https://coveralls.io/github/SentiSocial/sentisocial-backend?branch=coveralls'><img src='https://img.shields.io/coveralls/sentisocial/sentisocial-backend.svg' alt='Coverage Status' /></a>
<a href="https://github.com/SentiSocial/sentisocial-backend/blob/master/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
<a href="https://standardjs.com"><img alt="code style" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg"></a>
</p>

Originally created at The University of Toronto Scarborough's Hack the Valley 2017.

SentiSocial is a Twitter based trend analysis application.
This repository contains the SentiSocial backend, which queries the Twitter API
for current trends, collects data on each trend and exposes that data via a
public API.

Specifically, the backend collects the following information on trends:
- Average sentiment of tweets related to the trend (via the [NPM Sentiment Package](https://www.npmjs.com/package/sentiment))
- Popular tweets related to the trend
- News articles related to the trend (via the [News Api](https://newsapi.org))
- Keywords found in tweets related to the trend
- Countries in which the trend is trending
- Amount of time the trend has been trending for
- Volume of tweets related to the trend

This data is displayed nicely in the SentiSocial frontend, which can be found [here](https://github.com/SentiSocial/sentisocial-frontend).

The API is documented in api-doc.md.

## Requirements

* NodeJS ^6.9.4
* NPM
* MongoDB

## Running

Before running the backend, ensure you have node + NPM installed and run:

`npm install`

After installation, edit `config.js` to your liking, making sure to add the
address of your MongoDB server. You will also need to store your Twitter and
News API authentication keys in the following environment variables.

| key                         | environment variable        |
|-----------------------------|-----------------------------|
| Twitter consumer key        | TWITTER_CONSUMER_KEY        |
| Twitter consumer secret     | TWITTER_CONSUMER_SECRET     |
| Twitter access token        | TWITTER_ACCESS_TOKEN        |
| Twitter access token secret | TWITTER_ACCESS_TOKEN_SECRET |
| News API key                | NEWS_API_KEY                |

Then run:

`npm start`

To spin up the backend.

## Tests

Jasmine tests are located in the `spec` directory, to run them, use:

`npm test`

To run the tests and view test coverage with Istanbul, use:

`npm run test-cov`

## Style

This project uses the [JS standard code style](http://standardjs.com).

ESLint is already configured to check the code for adherence with standard.
To run it, use:

`npm run lint`

## License

All code in this repository is licensed under the MIT license. See the LICENSE
file for more details. All images and other assets are licensed under CC BY.
