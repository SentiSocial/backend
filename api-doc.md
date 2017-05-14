# SentiSocial API Reference

Summary:

| Method | Endpoint                  | Description                                              |
|--------|---------------------------|----------------------------------------------------------|
| GET    | /alltrends                | Get all current trends and data associated with each one |
| GET    | /trend/{name}             | Get in depth data data for a specified trend             |

## GET /v1/alltrends

Get all current trends sorted in order by current popularity and associated data.

Response:

| Name                      | Type   | Description                                                                             |
|---------------------------|--------|-----------------------------------------------------------------------------------------|
| trends                    | array  | Array of trends sorted most popular first                                               |
| trends[i]                 | object |                                                                                         |
| trends[i].name            | string | Name of Trend                                                                           |
| trends[i].sentiment_score | number | Sentiment score for this trend, higher values indicate a more positive sentiment        |

Example Request:
```
GET https://api.senti.social/alltrends
```

Example Response:
```
{
   "trends":[
      {
         "name":"Chelsea",
         "sentiment_score":2.17
      },
      {
         "name":"David Luiz",
         "sentiment_score":1.85
      },
      {
         "name":"#WannaCry",
         "sentiment_score":-0.57
      },
      {
         "name":"#ransomware",
         "sentiment_score":-0.36
      },
      {
         "name":"#nhscyberattack",
         "sentiment_score":-0.42
      },
      {
         "name":"#MasterChefUK",
         "sentiment_score":2.62
      },
      {
         "name":"#withfewexceptions",
         "sentiment_score":-0.07
      },
      {
         "name":"#SevenDaysToDead",
         "sentiment_score":0.08
      },
      {
         "name":"#BritishLGBTAwards",
         "sentiment_score":2.23
      },
      {
         "name":"#Gogglebox",
         "sentiment_score":0.62
      },
      {
         "name":"#InconvenienceAFilm",
         "sentiment_score":-0.42
      },
      {
         "name":"#FlashbackFriday",
         "sentiment_score":0.19
      }
   ]
}
```

## GET /v1/trends/{name}

Get detailed information about the specific trend

Response:

| Name                    | Type                    | Description                                                                                                        |
|-------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------------|
| name                    | string                  | Trend name echoed back                                                                                             |
| rank                    | number                  | Trend's popularity rank (index starts at 1)                                                                        |
| sentiment_score         | number &#124; null      | Sentiment score for the trend (Higher is more positive) (can be null if info is not available yet)                 |
| sentiment_description   | string &#124; null      | Human readable description of sentiment_score (eg. "Slightly Positive") (can be null if info is not available yet) |
| tweets_analyzed         | number                  | Number of tweets analyzed to obtain the sentiment score                                                            |
| tweet_volume            | number &#124; null      | Tweet volume for the past 24 hours (Can be null if info is not available)                                          |
| locations               | array                   | Array of country codes representing countries that the trend is trending in                                        |
| locations[i]            | string                  | ISO 3611 country code                                                                                              |
| keywords                | array                   | Array of keywords associated with the trend                                                                        |
| keywords[i]             | object                  |                                                                                                                    |
| keywords[i].word        | string                  | A keyword associated with the trend                                                                                |
| keywords[i].occurences  | number                  | Number of occurences of this keyword in analyzed tweets                                                            |
| articles                | array                   | Array of objects containing news articles, sorted by popularity of news source                                     |
| articles[i]             | object                  |                                                                                                                    |
| articles[i]._id         | string                  | Sequential unique identifier for news articles                                                                     |
| articles[i].title       | string                  | Article's headline                                                                                                 |
| articles[i].description | string                  | Article excerpt or description                                                                                     |
| articles[i].source      | string                  | Publishing organization of news article                                                                            |
| articles[i].link        | string                  | URL link to the article                                                                                            |
| articles[i].timestamp   | string                  | Unix timestamp in seconds of the publishing date                                                                   |
| articles[i].media       | string &#124; undefined | URL link to media associated with the article, can be undefined if no media exists                                 |
| tweets                  | array                   | Array of popular tweets related to the trend                                                                       |
| tweets[i]               |                         |                                                                                                                    |
| tweets[i].embed_id      | string                  | ID of the tweet that can be used to embed it on a webpage                                                          |

Example Request:
```
GET https://api.senti.social/trend/Chelsea
```

Example Response:

```
{
  "name" : "Chelsea",
  "rank" : 1,
  "sentiment_score" : 2.01,
  "sentiment_description" : "Very Positive",
  "tweets_analyzed" : 126556,
  "tweet_volume" : 403246,
  "locations" : [
    "AU",
    "IE",
    "GB",
    "US"
  ],
  "keywords" : [
    {
      "occurences" : 66,
      "word" : "chelsea"
    },
    {
      "occurences" : 59,
      "word" : "football"
    },
    {
      "occurences" : 30,
      "word" : "win"
    },
    {
      "occurences" : 15,
      "word" : "team"
    },
    {
      "occurences" : 15,
      "word" : "soccer"
    },
    {
      "occurences" : 9,
      "word" : "goal"
    },
    {
      "occurences" : 8,
      "word" : "points"
    },
    {
      "occurences" : 8,
      "word" : "penalty"
    },
    {
      "occurences" : 8,
      "word" : "league"
    },
    {
      "occurences" : 8,
      "word" : "premier"
    }
  ],
  "articles" : [
    {
      "media" : "http://ichef.bbci.co.uk/onesport/cps/624/cpsprodpb/15A57/production/_96036688_chelseacelebrate.jpg",
      "link" : "http://www.bbc.co.uk/sport/football/39813798",
      "source" : "BBC News",
      "timestamp" : 1494626338,
      "description" : "Chelsea are crowned Premier League champions as Michy Batshuayi's late goal gives them the win they needed to secure the title at West Brom.",
      "title" : "West Bromwich Albion 0-1 Chelsea"
    },
    {
      "media" : "http://ichef.bbci.co.uk/onesport/cps/624/cpsprodpb/15A57/production/_96036688_chelseacelebrate.jpg",
      "link" : "http://www.bbc.co.uk/sport/football/39813798",
      "source" : "BBC Sport",
      "timestamp" : 1494626338,
      "description" : "Chelsea are crowned Premier League champions as Michy Batshuayi's late goal gives them the win they needed to secure the title at West Brom.",
      "title" : "West Bromwich Albion 0-1 Chelsea"
    },
    {
      "media" : "http://ichef.bbci.co.uk/onesport/cps/624/cpsprodpb/EEF5/production/_96037116_antonioconte.jpg",
      "link" : "http://www.bbc.co.uk/sport/football/39905241",
      "source" : "BBC Sport",
      "timestamp" : 1494632312,
      "description" : "Chelsea need to win the FA Cup to turn a \"great season\" into a \"fantastic\" one after clinching the title, says manager Antonio Conte.",
      "title" : "Chelsea are Premier League champions: Antonio Conte targets Double"
    }
  ],
  "tweets" : [
    {
      "embed_id" : "863134776651374592"
    },
    {
      "embed_id" : "862940061624659968"
    },
    {
      "embed_id" : "863141907999973379"
    },
    {
      "embed_id" : "863136242279620608"
    },
    {
      "embed_id" : "863141446957846532"
    },
    {
      "embed_id" : "862863664327610369"
    },
    {
      "embed_id" : "863136436203261952"
    },
    {
      "embed_id" : "863138919822614529"
    },
    {
      "embed_id" : "863135537313533952"
    },
    {
      "embed_id" : "863117986768486401"
    }
  ]
}
```
