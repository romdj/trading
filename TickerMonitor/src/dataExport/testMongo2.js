const config = require('./mongoConfig');

const connect = (url, dbName, executionFn) => {
  const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');

  // Connection URL
  // const url = 'mongodb://localhost:27017';
  // Database Name
  // const dbName = 'myproject';

  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, client) {
    // assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    executionFn(db);

    client.close();
  });
};

const insertMany = function (dataCollection, tableName, callback) {
  connect(config.url, config.dbName, (db) => {
    const collection = db.collection(tableName);
    // Insert some documents
    collection.insertMany(dataCollection, (err, result) => {
      callback(result);
      if (err) {
        console.log(`err adding items! err: ${err}`);
      }
    });
  });
}

module.exports = {
  insertMany
}