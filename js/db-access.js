'use strict'
var MongoClient = require('mongodb').MongoClient

// Name of collection that stores documents representing each trend
var COLLECTION_NAME = 'trends'

// Connection URL
var url = 'mongodb://localhost:27017/twitterbot';

/**
 * Contains functions for reading to and writing from the mongo database.
 *
 * @constructor
 * @author GunshipPenguin
 * @param {Function} callback Function called when the db is ready
 */
var dbAccess = function (readyCallback) {
  var db
  MongoClient.connect(url, function(err, mongodb) {
    if (err !== null) {
      console.log('Error connecting to mongodb')
    } else {
      console.log("Connected correctly to server");
    }


    db = mongodb

    _ensureTrendExists('hello', function() {})

    readyCallback()
  });

  this.addSentimentInfo = function(trendName, sentimentInfo) {
    _ensureTrendExists(trendName, function() {
      var collection = db.collection(COLLECTION_NAME)
      collection.updateOne({ trend : trendName }, { $push: { sentiment : sentimentInfo } }, function(err, result) {
        if (err) {
          console.log('Error updating sentiment info in document')
        }
      });
    })
  }

  this.getSentimentInfo = function(trendName, callback) {
    // Get the documents collection
    var collection = db.collection(COLLECTION_NAME);
    // Find some documents
    collection.findOne({trend: trendName}, function(err, document) {
      if (err !== null) {
        console.log(err)
      } else {
        callback(document.sentiment)
      }
    });
  }

  this.addNewsArticles = function(trendName, newsArticles) {
    _ensureTrendExists(trendName, function() {
      var collection = db.collection(COLLECTION_NAME)
      collection.updateOne({ trend : trendName }, { $set: { news : newsInfo } }, function(err, result) {
        if (err) {
          console.log('Error updating newsarticles info in document')
        }
      });
    })
  }

  this.getNewsArticles = function(trendName, callback) {
    // Get the documents collection
    var collection = db.collection(COLLECTION_NAME);
    // Find some documents
    collection.findOne({trend: trendName}, function(err, document) {
      if (err !== null) {
        console.log(err)
      } else {
        callback(document.news)
      }
    });
  }

  this.addPopularTweets = function(trendName, popularTweets) {
    _ensureTrendExists(trendName, function() {
      var collection = db.collection(COLLECTION_NAME)
      collection.updateOne({ trend : trendName }, { $set: { popularTweets : popularTweets } }, function(err, result) {
        if (err) {
          console.log('Error updating newsarticles info in document')
        }
      });
    })
  }

  this.getPopularTweets = function(trendName, callback) {
    // Get the documents collection
    var collection = db.collection(COLLECTION_NAME);
    // Find some documents
    collection.findOne({trend: trendName}, function(err, document) {
      if (err !== null) {
        console.log(err)
      } else {
        callback(document.popularTweets)
      }
    });
  }

  /**
   * Given a trend name, insert a blank record in the correct collection in mongo.
   * if the trend does not already exist in the db. Call callback after.
   *
   * @param  {String} trend Trend to add if nonexistant
   */
  var _ensureTrendExists = function (trendName, callback) {
    // Get the documents collection
    var collection = db.collection(COLLECTION_NAME)

    // Check that the document does not exist
    collection.findOne({trend: trendName}, function(err, document) {
      if (err !== null) {
        console.log(err)
      } else {
        if (!document) {
          // Insert some documents
          collection.insertOne({trend: trendName , sentiment: [], news: [], popularTweets: []},
            function(err, result) {
              if (err) {
                console.log('Failed to insert blank document')
              }
          });
        }
      }
      callback()
    });
  }
}

module.exports = dbAccess
