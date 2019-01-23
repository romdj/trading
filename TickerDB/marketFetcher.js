const fs = require('fs');
const fetcher = require('./fetcher');
const ext = 'json'
const marketFiles = fs.readdirSync('./Markets').filter(f => f.endsWith('.' + ext)).map(f => f = './Markets/' + f);

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}

let tickers = [];
marketFiles.forEach(f => {
  const list = require(f);
  const ti = list.map(t => t = t['ACT Symbol']).filter(t => !t.includes('$'));
  tickers.push(...ti);
  // return list;
  
})
tickers = tickers.sort().unique();
console.log(tickers.length);
const aFetcher = fetcher(tickers);
console.log(aFetcher);