import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/ticker-db");

export function exportToMongo(data) {
  console.log('exporting data to Mongo DB!');
}