var GoogleStocksWatch = require('google-stocks-watch'),
    googleStocksWatch;
 
var config = {
  timerInterval: 8000, // milliseconds
  stocks: {
    'AAPL': {
      amount: '2',
    },
    'GOOG': {
      amount: '10',
    }
  }
};
 
googleStocksWatch = new GoogleStocksWatch(config, function(err, data) {
  console.log(data);
});
 
googleStocksWatch.start();

/**
[ { code: 'AAPL',
    amount: '2',
    current_time: 'May 4, 4:47PM EDT',
    current_price: '128.77',
    current_total_price: '257.54',
    purchased_price: '130.10',
    purchased_total_price: '260.20',
    diff: '-2.66',
    percentage: '-1.02%' },
  { code: 'GOOG',
    amount: '10',
    current_time: 'May 4, 4:46PM EDT',
    current_price: '540.97',
    current_total_price: '5409.70',
    purchased_price: '520.55',
    purchased_total_price: '5205.50',
    diff: '204.20',
    percentage: '3.92%' } ]
**/