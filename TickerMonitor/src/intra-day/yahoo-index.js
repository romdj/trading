'use strict';

const hash = require('object-hash');
const yahooFinance = require('yahoo-finance');
const { writeFileSync, appendFileSync, readFileSync, copyFileSync } = require('fs');
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

const NYSE = require('../../../DataSets/json/NYSE');
const NASDAQ = require('../../../DataSets/json/NASDAQ');

const dynamodbConfig = require(`${process.cwd()}/config/dynamo.json`);

AWS.config.apiVersions = { dynamodb: '2012-08-10' };
AWS.config.update({ region: 'us-east-1' });

let counter = 0;
const dynamodb = new AWS.DynamoDB();
const dateList = [];
const dateRange = { begin: '2018-01-01', end: '2018-12-31' };
const tickers = [...NYSE, ...NASDAQ];
const results = [];
const errTickers = [];
const maxItemPerQuery = 25;
const errDataPath = `${process.cwd()}/ResultData/ErrorTickers_intra-day.json`;
const errLogPath = `${process.cwd()}/ResultData/error_intra-day.log`;
const resultDataPath = `${process.cwd()}/ResultData/resultorTickers_intra-day.json`;
const resultLogPath = `${process.cwd()}/ResultData/result_intra-day.log`;
const dynamoFailedPath = `${process.cwd()}/ResultData/dynamo_failedQueries.json`;


yahooFinance.quote({
  symbol: 'AAPL',
  modules: ['summaryProfile', 'financialData', 'recommendationTrend',
    'upgradeDowngradeHistory', 'earnings', 'price', 'summaryDetail',
    'defaultKeyStatistics', 'calendarEvents'] // see the docs for the full list
}, function (err, quotes) {
  // ...
  console.log(JSON.stringify(quotes));
});