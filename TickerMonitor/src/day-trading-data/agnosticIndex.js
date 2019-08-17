'use strict';

const hash = require('object-hash');
const yahooFinance = require('yahoo-finance');
const { appendFileSync } = require('fs');

const NYSE = require('../../../DataSets/json/NYSE');
const NASDAQ = require('../../../DataSets/json/NASDAQ');

const dateRange = { begin: '2018-01-01', end: '2018-01-15' };
const tickers = [...NYSE, ...NASDAQ];
const errTickers = [];

const OutputConfig = require('./indexConfig');
const DBCollection = [];
OutputConfig.DB.filter(db => db.enabled === true).forEach(db => { console.log(db); DBCollection.push(require(db.exportPath)) });
DBCollection.forEach(db => db.deleteOne({id: 'ccb777a8df21cc8589f0e20af5e4f3d3ef5ee770'}, 'trading', 'day-trading'));
// DBCollection.forEach(db => db.deleteMany({symbol: 'ADS'}, 'trading', 'day-trading'));
// DBCollection.forEach(db => db.insertMany(tickers, 'trading', 'day-trading'));
process.exit(0);
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
      quotes.map(quote => {
        quote.intraday = false;
        quote.id = hash(quote);
      });
      DBCollection.forEach(db => db.insertMany(quotes, 'trading', 'day-trading'));
    }
  });
});

