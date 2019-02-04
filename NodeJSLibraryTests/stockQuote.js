// https://www.npmjs.com/package/stock-quote

const quote = require('stock-quote');
quote.getQuote('GOOGL') // or quote.getQuote('GOOGL', '');
.then( (data) => {
    console.log(JSON.stringify(data, null, 4));
});