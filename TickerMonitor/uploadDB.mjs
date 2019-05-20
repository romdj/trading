import request from 'request';
// import http from 'http';
import fs from 'fs';
// import uuidv3 from 'uuid/v3';
import uuidv4 from 'uuid/v4';
// import uuidv5 from 'uuid/v5'; USEFUL IF WANT TO GENERATE KEY FROM STRING THROUGH KEY SHARDING
import {
//     exportToMongo
parseFolderForData
} from './dataExporter';

// const markets = [
//     { name: 'Nasdaq', path: '../DataSets/NASDAQ.json' },
//     { name: 'NYSE', path: '../DataSets/NYSE.json' }
// ];

const yahooURL = 'https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com';
const fields = ['symbol', 'marketState', 'regularMarketPrice', 'regularMarketChange', 'regularMarketChangePercent', 'preMarketPrice', 'preMarketChange', 'preMarketChangePercent', 'postMarketPrice', 'postMarketChange', 'postMarketChangePercent'];
const finalQueryScript = 'https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&fields=symbol,marketState,regularMarketPrice,regularMarketChange,regularMarketChangePercent,preMarketPrice,preMarketChange,preMarketChangePercent,postMarketPrice,postMarketChange,postMarketChangePercent&symbols=';
import nasdaq from '../DataSets/NASDAQ.json';
import nyse from '../DataSets/NYSE.json';
const tickerCollection = [...nasdaq, ...nyse];
const urlMaxLength = 2083;
const rootLength = 310;
const tickersMaxLength = urlMaxLength - rootLength; // 4 because max Ticker size is 4 (btw result is 443 ticker/request);
const tickersPerRequest = urlMaxLength - rootLength / 4; // 4 because max Ticker size is 4 (btw result is 443 ticker/request);
const tickerCollections = (collection) => { //we stack together tickers in order to fit them into a URL
    const collections = [];
    const tmpArray = [];
    while (collection.length > 0) {
        if (tmpArray.length + 4 > tickersMaxLength) {
            collections.push([...tmpArray]);
            tmpArray = [];
        }
        tmpArray.push(collection.pop());
    }
    collections.push([...tmpArray]);
    return collections;
};
// request(`${finalQueryScript}${nasdaq[0]}`, function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });
request
    .get(`${finalQueryScript}${nasdaq[0]}`, {
        json: true
    })
    // .on('response', response => fs.writeFileSync('httpResponse.json', JSON.stringify(response, null, 2), 'utf8'))
    .on('error', function (err) {
        console.log(err)
    })
    // .pipe(fs.createWriteStream(`./fileRepository/toto.json`));
    .pipe(fs.createWriteStream(`./fileRepository/${uuidv4()}.json`))
    // .
// .pipe(JSONStream.parse()

parseFolderForData();

// sdasds.on('finish', outputDataSTD(sdasds));
// function outputDataSTD(jsonStream) {
//     console.log(jsonStream);
//   .pipe(fs.createWriteStream('doodle.png'))
// }