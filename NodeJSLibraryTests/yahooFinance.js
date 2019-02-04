// https://www.npmjs.com/package/yahoo-finance


const yahooFinance = require('yahoo-finance');
const nasdaqList = require('../DataSets/NASDAQ.json');
const outList = './result.json';
const fs = require('fs');

const resultList = [];
/*
yahooFinance.historical({
  symbol: 'AAPL',
  from: '2012-01-01',
  to: '2012-12-31',
  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
}, function (err, quotes) {
  if (err) {
    console.log('historical: error Querying!');
    return -1;
  }
  console.log('historical: ', JSON.stringify(quotes, null, 2));
});
*/

// This replaces the deprecated snapshot() API
Promise.all(nasdaqList.forEach(async (ticker) => {
    try {
      yahooFinance.quote({
        symbol: ticker,
        modules: ['price', 'summaryDetail'] // see the docs for the full list
      }, function (err, quotes) {
        if (err) {
          console.log('error Querying2!');
          return -1;
        }
        // console.log('quoting : ', JSON.stringify(quotes,null,2));
        // fs.writeFileSync(outList, JSON.stringify(quotes, null, 2));
        resultList.push(quotes);
      })
    } catch (err) {
      console.log(`Error querying quote for ${ticker}, Error: `, err);
    }
  }))
  .then(() => fs.writeFileSync(outList, JSON.stringify(resultList, null, 2)))
  .catch(err => console.log(`ERROR PROMISE ALL: ${err}`));