const yahooFinance = require('yahoo-finance');
const elasticsearch = require('elasticsearch');
// const uuidv4 = require('uuid/v4');
const fs = require('fs');

const quotes = ['AAPL'];
// const quotes = require('../DataSets/NASDAQ.json');
const errLogPath = './Logs/DataFetcherErrorLog.log';

const y2018 = {
  start: '2017-01-01', end: '2018-12-31'
};

const esClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

quotes.forEach(quote => {
  const bulkInput = '';
  yahooFinance.historical({
    symbol: quote,
    from: y2018.start,
    to: y2018.end,
    // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
  }, function (err, result) {
    if (err) {
      if (!fs.existsSync(errLogPath))
        fs.writeFileSync(errLogPath, err, 'utf8');
      else
        fs.appendFileSync(errLogPath, err, 'utf8');
    } else {
      result.forEach(obj => {
        bulkInput += JSON.stringify({ _index: 'symbol', _type: 'macro', _id: Number(Math.random() * 10000) });
        bulkInput += "\n";
        bulkInput += JSON.stringify(obj);
        bulkInput += "\n";
      });
    }
    console.log(`bulkInput BEGIN MESSAGE: ${bulkInput} bulkInput END MESSAGE`);
    esClient.bulk(bulkInput, (err, response) => {
      if (err) {
        if (!fs.existsSync(errLogPath))
          fs.writeFileSync(errLogPath, err, 'utf8');
        else
          fs.appendFileSync(errLogPath, err, 'utf8');
      } else {
        console.log(`Success uploading data for quote ${quote}, response message: ${response}`);
      }
    });
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