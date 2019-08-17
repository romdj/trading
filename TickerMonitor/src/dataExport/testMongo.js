// const mongoose = require('mongoose');
// const mongodb = require('mongodb');
// mongoose.
// mongodb.Db

function insertOne(dataItem, dbName, tableName) {

  const { MongoClient } = require('mongodb');
  const url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db(dbName);
    dbo.collection(tableName).insertOne(dataItem, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}
function insertMany(dataArray, dbName, tableName) {
  const { MongoClient } = require('mongodb');
  const url = "mongodb://localhost:27017/";
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db(dbName);
    dbo.collection(tableName).insertMany(dataArray, function (err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });
}

function deleteOne(query, dbName, tableName) {
  const { MongoClient } = require('mongodb');
  const url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db(dbName);
    // const myquery = { address: 'Mountain 21' };
    dbo.collection(tableName).deleteOne(query, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
}

function deleteMany(query, dbName, tableName) {
  const { MongoClient } = require('mongodb');
  const url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db(dbName);
    // const myquery = { address: /^O/ };
    dbo.collection(tableName).deleteMany(query, function (err, obj) {
      if (err) throw err;
      console.log(obj.result.n + " document(s) deleted");
      db.close();
    });
  });
}

function purge(dbName, tableName) {
  const { MongoClient } = require('mongodb');
  const url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db(dbName);
    dbo.collection(tableName).deleteMany({}, function (err, obj) {
      if (err) throw err;
      console.log(obj.result.n + " document(s) deleted");
      db.close();
    });
  });
}
module.exports = { insertOne, insertMany, deleteOne, deleteMany, purge };