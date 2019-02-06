// https://www.npmjs.com/package/get-stock

var getStock = require('get-stock')

// const stocks =  require('../DataSets/NASDAQ.json');
var stocks = ['YHOO', 'TFSC']
getStock(stocks)
  .then(function (res) {
  console.log(res);
})