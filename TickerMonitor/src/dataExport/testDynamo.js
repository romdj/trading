'use strict';

const { appendFileSync, readFileSync } = require('fs');
const AWS = require('aws-sdk');

AWS.config.apiVersions = { dynamodb: '2012-08-10' };
AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB();
const maxItemPerQuery = 25;
const errDataPath = `${process.cwd()}/ResultData/ErrorTickers_day-to-day.json`;
const dynamoFailedPath = `${process.cwd()}/ResultData/dynamo_failedQueries.json`;

const formatDataDynamo = (quotes) => {
  const sizedQuotes = [];
  if (JSON.stringify(quotes).length > 2 || quotes.length !== 0) {
    if (quotes.length > maxItemPerQuery) {
      for (let index = 0; index < quotes.length; index += maxItemPerQuery) {
        const endIndex = (index + 24 > quotes.length) ? quotes.length - 1 : index + 24;
        sizedQuotes.push(quotes.slice(index, endIndex));
      }
      return sizedQuotes;
    }
  }
  return [quotes];
};

const dispatchDynamo = (quotes, tableName) => {
  if (JSON.stringify(quotes).length > 2 || quotes.length !== 0) {
    if (JSON.stringify(quotes).length < 15000 && quotes.length <= maxItemPerQuery) {
      const query = generateQuery(quotes, tableName);
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
  return { RequestItems: { tableName: items } };
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

function insertMany(dataArray, tableName) {
  formatDataDynamo(dataArray)
    .forEach(formatQuotes => dispatchDynamo(formatQuotes, tableName));
}
module.exports = {
  insertOne, insertMany, deleteOne, deleteMany
}