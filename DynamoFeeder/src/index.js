'use strict';

const yahooFinance = require('yahoo-finance');
const rp = require('request-promise');
const { appendFileSync } = require('fs');
const AWS = require('aws-sdk');
const moment = require('moment');

const NYSE = require('../../DataSets/json/NYSE');
const NASDAQ = require('../../DataSets/json/NASDAQ');

const serverConfig = require('../../config.json');
const dynamodbConfig = require('../config/dynamo.json');
const url = serverConfig.url;

AWS.config.apiVersions = { dynamodb: '2012-08-10' };
AWS.config.update({ region: 'us-east-1' });

let counter = 0;
const dynamodb = new AWS.DynamoDB();
const dateList = [];

const dateRanges = [
  { begin: '2015-01-01', end: '2016-01-01' },
  { begin: '2016-01-01', end: '2017-01-01' },
  { begin: '2017-01-01', end: '2018-01-01' },
  { begin: '2018-01-01', end: '2018-04-01' },
  { begin: '2018-04-01', end: '2018-07-01' },
  { begin: '2018-07-01', end: '2018-10-01' },
  { begin: '2018-10-01', end: '2019-01-01' },
];
for (let i = 1; i < moment().month(); i++) {
  dateRanges.push({
    begin: `2019-${(i + 1 < 10) ? 0 : ''}${i + 1}-01`,
    end: `2019-${(i + 2 < 10) ? 0 : ''}${i + 2}-01`
  });
}

// const dateRange = { begin: '2015-01-01', end: '2019-07-17' };
const tickers = [...NYSE, ...NASDAQ];
const results = [];
const errTickers = [];
const errDataPath = `${process.cwd()} / ResultData / ErrorTickers_day - to - day.json`;

dateRanges.forEach((dateRange) => {
  tickers.forEach(ticker => {
    yahooFinance.historical({
      symbol: ticker,
      from: dateRange.begin,
      to: dateRange.end,
      period: 'd'
      // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
    }, (err, quotes) => {
      if (err) {
        console.log(`err fetching data err: ${err}`);
        errTickers.push({ ticker: ticker, date: dateRange })
        appendFileSync(errDataPath, JSON.stringify(errTickers), 'utf8');
      }
      else {
        rp.post(url, { body: quotes, json: true }).then(response => console.log(response));
      }
    });
  });
})

