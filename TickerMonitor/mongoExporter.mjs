import mongoose, { Mongoose } from 'mongoose';

const dbName = 'macro';
mongoose.connect(`mongodb://localhost/${dbName}`);

const historicalStockSchema = new mongoose.Schema({
    date: Date,
    open: Schema.Types.Decimal128,
    high: Schema.Types.Decimal128,
    low: Schema.Types.Decimal128,
    close: Schema.Types.Decimal128,
    adjClose: Schema.Types.Decimal128,
    volume: Number,
    symbol: String
  });


  function exportMongo(recordCollection) {
  
  }
  