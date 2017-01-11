'use strict'
var MongoClient = require('mongodb').MongoClient
var config = require('./config')

// Connection URL
var url = 'mongodb://localhost:27017/' + config.dbName;

/**
 * Contains functions for reading to and writing from the mongo database.
 *
 * @constructor
 * @author GunshipPenguin
 * @param {Function} readyCallback Function called when the db is ready
 */
var dbAbstraction = function (readyCallback) {
  // Connect to the database
  var db
  MongoClient.connect(url, function(err, mongoDb) {
    if (err !== null) {
      console.log('Error connecting to mongodb')
    } else {
      console.log("Successfully Connected to mongodb");
    }

    db = mongoDb

    readyCallback()
  });


  /**
   * Removes all trends from the database not in the trends array, adds a new
   * empty trend document to the database for each trend in trends not already
   * in trends. Calls cb when done.
   *
   * @param {Array} trends Array of strings representing trend names
   */
  this.addNewTrends = function (trends, cb) {
    var collection = db.collection(config.collectionName)

    // Remove all documents not in trends
    collection.find({}).toArray(function (err, trendDocs) {
      trendDocs.forEach(function(trendDoc) {
        // If trendDoc is not in trends
        if (trends.indexOf(trendDoc) === -1) {
          collection.deleteOne({name: trendDoc.name}, function() {})
        }
      })
    })

    // Add new empty trends for all new trends
    var added = 0
    trends.forEach(function (trend) {
      // Search the db for this new trend
      collection.find({name: trend}, function (err, docs) {
        // If this new trend does not exist in the db, create a document for it
        if (docs.length !== 0) {
          _addBlankTrendDocument(trend, function() {})
        }

        // Call cb if all trends have been added
        added++
        if (added == trends.length) {
          cb()
        }
      })
    })
  }

  /**
   * Adds a new sentiment info object to the trend with name trendName in the
   * database.
   *
   * @param {String} trendName Name of Trend
   * @param {Object} sentimentInfo Object representing the trend's sentiment for a specific timeg
   * @param {Number} sentimentInfo.timestamp Unix time stamp representing time that sentimentInfo was calculated at
   * @param {Number} sentimentInfo.sentiment Sentiment value of the trend at the time specified by sentimentInfo.timeStamp
   * @param {Function} cb Function to be called after the sentiment info has been added
   */
  this.addSentimentInfo = function(trendName, sentimentInfo, cb) {
    var collection = db.collection(config.collectionName)
    collection.updateOne({name: trendName}, {$push: {history: sentimentInfo}}, function (err, result) {
      if (err) {
        console.log('Error updating sentiment info in document')
      } else {
        cb()
      }
    })
  }

  /**
   * Sets the trend with name trendName's news articles to the specified news
   * articles in the db.
   *
   * @param {String} trendName Name of the trend
   * @param {Array} news News articles to set for the trend with name trendName
   * @param {Function} cb Function to be called after the news articles have been set
   */
  this.addNews = function(trendName, news, cb) {
    var collection = db.collection(config.collectionName)
    collection.updateOne({name: trendName }, {$set: {news: news}}, function(err, result) {
      if (err) {
        console.log('Error updating news articles info in document')
      } else{
        cb()
      }
    });
  }

  /**
   * Sets the trend with name trendName's associated tweets to the specified
   * tweets in the db.
   *
   * @param {String} trendName Name of the trend
   * @param {Array} tweets Tweets to be set for the trend with name trendName
   * @param {Function} cb Function to be called after the tweets have been set
   */
  this.addTweets = function(trendName, tweets, cb) {
    var collection = db.collection(config.collectionName)
    collection.updateOne({name: trendName }, {$set: {tweets: tweets}}, function(err, result) {
      if (err) {
        console.log('Error updating tweets info in document')
      } else {
        cb()
      }
    });
  }

  /**
   * Get an array of trend objects representing all the current trends and
   * their associated data.
   *
   * @param {Function} cb Function to be called with the array of trend objects after retreival
   */
  this.getTrendInfo = function(cb) {
    var collection = db.collection(config.collectionName)
    collection.find({}).toArray(function(err, docs) {
      if (err) {
        console.log('Error while retreiving trend information')
      } else {
        cb(docs)
      }
    })
  }

  /**
   * Given a trend name, insert a blank record in the correct collection in
   * mongo. Call cb after.
   *
   * @param  {String} trend Name of trend to add
   */
  var _addBlankTrendDocument = function (trendName, cb) {
    // Get the documents collection
    var collection = db.collection(config.collectionName)

    // Create the blankTrend object to be inserted into collection
    var blankTrend = {
      name: trendName,
      history: [],
      tweets: [],
      news: []
    }

    // Insert blankTrend into the collection
    collection.insertOne(blankTrend, function(err, result) {
      if (err) {
        console.log('Could not insert a blank trend into the database')
      }
      cb()
    })
  }
}

module.exports = dbAbstraction
