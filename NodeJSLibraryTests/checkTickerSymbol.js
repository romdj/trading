const fs = require('fs');

const nasdaqList = require('../DataSets/NASDAQ.json');
const cts = require('check-ticker-symbol');
const validList = [];
const wrongList = [];
nasdaqList.map((ticker) => {
  if (cts.valid(ticker)) {
    // validList.push(ticker);
  } else {
    // wrongList.push(ticker);
  }
});

// var symbolObject = cts.disassemble('GOOG.BY');
// console.log(symbolObject.search); // GOOG.BY
// console.log(symbolObject.prefixedExchangeCode); // undefined
// console.log(symbolObject.stock); // GOOG
// console.log(symbolObject.suffixedExchangeCode); // BY
console.log('validList: ', ...validList);
console.log('wrongList: ', ...wrongList);

fs.writeFileSync('../DataSets/validNasdaq.json', JSON.stringify(validList));
