const http = require('http');
const config = require(`${process.cwd()}/../config.json`);
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

const recordsToAdd = [];

AWS.config.apiVersions = { dynamodb: '2012-08-10' };
AWS.config.update({ region: 'us-east-1' });
const dynamodbConfig = require(`${process.cwd()}/config/dynamo.json`);

setInterval(() => { pushToDynamoRoutine(); }, 500);

http.createServer((req, res) => {
  req.on('data', async items => {
    const records = JSON.parse(items.toString()); // convert Buffer to string
    recordsToAdd.push(...records);
    if (!isRoutineActive) {
      pushToDynamoRoutine();
    }
    res.writeHead(200);
    res.end(`${recordsToAdd.length} to be pushed`);
  });
}).listen(config.port);

function pushToDynamoRoutine() {
  if (recordsToAdd.length) {
    dispatchDynamo()
  }
}

const dispatchDynamo = () => {
  console.log(generateQuery(recordsToAdd.pop()));
  /*
  const query = generateQuery(recordsToAdd.pop());
  appendFileSync(errDataPath, JSON.stringify(query), 'utf8');
  dynamodb.batchWriteItem(query, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      appendFileSync(dynamoFailedPath, JSON.stringify(query), 'utf8');
    } else console.log(data);
  });
  */
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