const http = require('http');
const serverConfig = require('../../config.json');
const AWS = require('aws-sdk');
const { appendFileSync } = require('fs');
const hash = require('object-hash');

const maxItemPerQuery = 25;
const recordsToAdd = [];

AWS.config.apiVersions = { dynamodb: '2012-08-10' };
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB();
const dynamodbConfig = require(`${process.cwd()}/config/dynamo.json`);
const dynamoFailedPath = 'log/failedQueries.json'
const errDataLogPath = 'log/errorDispatchDynamo.log'
setInterval(() => { if(recordsToAdd.length > 0)dispatchDynamo(); }, 500);

http.createServer((req, res) => {
  req.on('data', (items) => {
    const quotes = JSON.parse(items.toString());
    quotes.map(quote => {
      quote.intraday = false;
      quote.id = hash(quote);
      recordsToAdd.push(quote);
    });
    res.writeHead(200);
    res.end(`${recordsToAdd.length} to be pushed`);
  });
}).listen(serverConfig.port);

const dispatchDynamo = () => {
  const endNumber = recordsToAdd.length > 25 ? 25 : recordsToAdd.length - 1;
  const query = generateQuery(recordsToAdd.splice(0,endNumber));
  dynamodb.batchWriteItem(query, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      appendFileSync(dynamoFailedPath, JSON.stringify(query), 'utf8');
    } else console.log(data);
  });
};

const generateQuery = (objects) => {
  const items = [];
  items.splice
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