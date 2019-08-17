'use strict';

const hash = require('object-hash');
const yahooFinance = require('yahoo-finance');
const { writeFileSync, appendFileSync, readFileSync, copyFileSync } = require('fs');
const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const request = require('request-promise');

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
const errDataPath = `${process.cwd()}/ResultData/ErrorTickers_day-to-day.json`;
const errLogPath = `${process.cwd()}/ResultData/error_day-to-day.log`;
const resultDataPath = `${process.cwd()}/ResultData/resultorTickers_day-to-day.json`;
const resultLogPath = `${process.cwd()}/ResultData/result_day-to-day.log`;
const dynamoFailedPath = `${process.cwd()}/ResultData/dynamo_failedQueries.json`;

const formatDataDynamo = (quotes) => {
  const sizedQuotes = [];
  if (JSON.stringify(quotes).length > 2 || quotes.length !== 0) {
    if (quotes.length > maxItemPerQuery) {
      for (let index = 0; index < quotes.length; index += maxItemPerQuery) {
        const endIndex = (index + 24 > quotes.length) ? quotes.length - 1 : index + 24;
        // console.log(`splicing quotes, length: ${quotes.length}`);
        sizedQuotes.push(quotes.slice(index, endIndex));
      }
      // while (quotes.length > 0)
      //   console.log(`splicing quotes, length: ${quotes.length}`);
      // sizedQuotes.push(quotes.splice(0, quotes.length > maxItemPerQuery ? 24 : quotes.length));
      return sizedQuotes;
    }
  }
  return [quotes];
};

const dispatchDynamo = (quotes) => {
  if (JSON.stringify(quotes).length > 2 || quotes.length !== 0) {
    if (JSON.stringify(quotes).length < 15000 && quotes.length <= maxItemPerQuery) {
      const query = generateQuery(quotes);
      appendFileSync(errDataPath, JSON.stringify(query), 'utf8');
      dynamodb.batchWriteItem(query, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          appendFileSync(dynamoFailedPath, JSON.stringify(query), 'utf8');
        } else console.log(data);
      });
    }
  }
  if (!(JSON.stringify(quotes).length > 2 && JSON.stringify(quotes).length < 15000 && quotes.length <= maxItemPerQuery))
    console.log(`item outside the size range: ${quotes.length}, ${JSON.stringify(quotes).length} ignoring`);
};

const generateQuery = (objects) => {
  const items = [];
  objects.forEach(obj => items.push(
    {
      PutRequest: {
        Item: {
          "id": {
            S: `${obj.id}`
          },
          "date": {
            S: `${obj.date}`
          },
          "open": {
            N: `${obj.open}`
          },
          "high": {
            N: `${obj.high}`
          },
          "low": {
            N: `${obj.low}`
          },
          "close": {
            N: `${obj.close}`
          },
          "adjClose": {
            N: `${obj.adjClose}`
          },
          "volume": {
            N: `${obj.volume}`
          },
          "symbol": {
            S: `${obj.symbol}`
          },
          "intraday": {
            BOOL: obj.intraday
          }
        }
      }
    }
  ));
  return { RequestItems: { "trading": items } };
};

const dispatchFailedQueries = () => {
  const queries = readFileSync(dynamoFailedPath, 'utf8').split('}{');
  // writeFileSync(dynamoFailedPath, '', 'utf8');
  queries.forEach(query => {
    console.log(query);
    // dynamodb.batchWriteItem(JSON.parse(query), function (err, data) {
    //   if (err) {
    //     console.log(err, err.stack);
    //     appendFileSync(dynamoFailedPath, JSON.stringify(query), 'utf8');
    //   } else console.log(data);
    // });
  });
}

function insertMany(dataArray, dbName, tableName) {
  formatDataDynamo(dataArray)
    .forEach(formatQuotes => dispatchDynamo(formatQuotes));
}
module.exports = {
  insertOne, insertMany, deleteOne, deleteMany
}