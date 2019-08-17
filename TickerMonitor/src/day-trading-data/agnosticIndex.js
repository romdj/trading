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
// DBCollection.forEach(db => db.deleteOne({id: 'ccb777a8df21cc8589f0e20af5e4f3d3ef5ee770'}, 'trading', 'day-trading'));
// DBCollection.forEach(db => db.deleteMany({intraday: false}, 'trading', 'day-trading'));
// DBCollection.forEach(db => db.purge('trading', 'day-trading'));
// process.exit(0);
try {
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
        // appendFileSync(errDataPath, JSON.stringify(errTickers), 'utf8');
        appendFileSync(`./${ticker}ErrLog.log`, `${ticker}: ${JSON.stringify(err)}`, 'utf8');
      }
      else {
        quotes.map(quote => {
          quote.id = hash(quote);
        });
        DBCollection.forEach(db => db.insertMany(quotes, 'trading', console.log));
      }
    });
  });

} catch (err) {
  console.log(errTickers, err);
  appendFileSync('./errLog', err, 'utf8');
};