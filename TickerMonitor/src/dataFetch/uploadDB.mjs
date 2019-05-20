import request from 'request-promise-native';
// import http from 'http';
import {writeFileSync, appendFileSync} from 'fs';
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
            tmpArray.splice(0,tmpArray.length);
        }
        tmpArray.push(collection.pop());
    }
    collections.push([...tmpArray]);
    return collections;
};
// const coll = ;
// console.log(tickerCollections(tickerCollection));

const timestamp = [];
tickerCollections(tickerCollection).forEach(aCollection => request
    .get(`${finalQueryScript}${aCollection}`, {json:true})
    .on('error', function (err) {
        console.error(err)
    })
    // .then(something => timestamp.push(something))
    // .then(something => console.log(something))
    .then(something => appendFileSync('./extract.json', JSON.stringify(something, null, 2), 'utf8')));
// console.log(JSON.stringify(timestamp, null, 2));
// writeFileSync('./extract.json', JSON.stringify(timestamp, null, 2), 'utf8');
// writeFileSync('./extract2.json', timestamp, 'utf8');
