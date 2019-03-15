import yahooFinance from 'yahoo-finance';
import elasticsearch from 'elasticsearch';
// import uuidv4 from 'uuid/v4';

import fs from 'fs';

import * as quotes from '../DataSets/NASDAQ.json';

const y2018 = {
  start: '2017-01-01', end: '2018-12-31'
};

const esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

quotes.forEach(quote => {
  yahooFinance.historical({
    symbol: quote,
    from: y2018.start,
    to: y2018.end,
    // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
  }, function (err, result) {
    const bulkInput = [];
    result.forEach(obj => {
      bulkInput.push(Object.assign({}, obj, { _index: 'symbol', _type: 'macro', _id: Number (Math.random() * 10000) }));

    })
    console.log(bulkInput);
    // esClient.bulk({ body: bulkInput }, (err, response) => { console.log(response); });
    // console.log('Result: ', result);
    // fs.writeFileSync(`./ResultData/${quote}.json`, JSON.stringify(result), 'utf8');

  });
});

if (1 === 0) {
  // This replaces the deprecated snapshot() API
  yahooFinance.quote({
    symbol: 'AAPL',
    modules: ['price', 'summaryDetail'] // see the docs for the full list
  }, function (err, quotes) {
    // ...
  });

  yahooFinance.historical({
    symbol: SYMBOL,
    from: START_DATE,
    to: END_DATE
  }, function (err, quotes) {
    /*
    [
      {
        date: Thu Nov 07 2013 00:00:00 GMT-0500 (EST),
        open: 45.1,
        high: 50.09,
        low: 44,
        close: 44.9,
        volume: 117701700,
        adjClose: 44.9,
        symbol: 'TWTR'
      },
      ...
      {
        date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
        open: 42.34,
        high: 45.67,
        low: 42.24,
        close: 44.69,
        volume: 11090800,
        adjClose: 44.69,
        symbol: 'TWTR'
      }
    ]
    */
  });
  yahooFinance.historical({
    symbols: [SYMBOL1, SYMBOL2],
    from: START_DATE,
    to: END_DATE
  }, function (err, result) {
    /*
    {
      YHOO: [
        {
          date: Fri Apr 12 1996 00:00:00 GMT-0400 (EDT),
          open: 25.25,
          high: 43,
          low: 24.5,
          close: 33,
          volume: 408720000,
          adjClose: 1.38,
          symbol: 'YHOO'
        },
        ...
        {
          date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
          open: 35.07,
          high: 35.89,
          low: 34.76,
          close: 35.69,
          volume: 21368600,
          adjClose: 35.69,
          symbol: 'YHOO'
        }
      ],
      GOOGL: [
        {
          date: Thu Aug 19 2004 00:00:00 GMT-0400 (EDT),
          open: 100,
          high: 104.06,
          low: 95.96,
          close: 100.34,
          volume: 22351900,
          adjClose: 100.34,
          symbol: 'GOOGL'
        },
        ...
        {
          date: Thu Nov 14 2013 00:00:00 GMT-0500 (EST),
          open: 1033.92,
          high: 1039.75,
          low: 1030.35,
          close: 1035.23,
          volume: 1166700,
          adjClose: 1035.23,
          symbol: 'GOOGL'
        }
      ],
      ...
    }
    */
  });
  var httpRequestOptions = {
    proxy: 'http://localproxy.com'
  };


  yahooFinance.historical({
    symbol: SYMBOL,
    from: START_DATE,
    to: END_DATE
  }, httpRequestOptions, function (err, quotes) {
    // Result
  });


  yahooFinance.quote({
    symbol: SYMBOL,
    modules: MODULES  // ex: ['price', 'summaryDetail']
  }, httpRequestOptions, function (err, snapshot) {
    // Result
  });
}