# SentiSocial API Reference

Summary:

| Method | Endpoint                  | Description                                              |
|--------|---------------------------|----------------------------------------------------------|
| GET    | /v1/alltrends             | Get all current trends and data associated with each one |
| GET    | /v1/trend/{name}          | Get data for the specified trend                         |
| GET    | /v1/trend/{name}/tweets   | Get tweets related to the specified trend                |
| GET    | /v1/trend/{name}/articles | Get news articles related to the specified trend         |

## GET /v1/alltrends

Get all current trends and associated data for each one

Response:

| Name                | Type          | Description                                                                             |
|---------------------|---------------|-----------------------------------------------------------------------------------------|
| trends              | array         | Array of trends sorted most popular first                                               |
| trends[i]           | object        |                                                                                         |
| trends[i].name      | string        | Name of Trend                                                                           |
| trends[i].sentiment | number        | Latest sentiment score for this trend, higher values indicate a more positive sentiment |

Example Request:
```
GET https://senti.social/v1/Daft%20Punk
```

Example Response:
```
{
  "trends": [
    {
      "name": "Daft Punk",
      "sentiment": 2.3
    }
  ]
}
```

## GET /v1/trend/{name}

Get data for the specified trend

Response:

| Name                 | Type          | Description                                                                             |
|----------------------|---------------|-----------------------------------------------------------------------------------------|
| name                 | string        | Trend name echoed back                                                                  |
| history              | array         | Array of objects containing timestamp and sentiment, sorted oldest first                |
| history[i]           | object        |                                                                                         |
| history[i].timestamp | number        | Unix timestamp in seconds that this history object was recorded at                      |
| history[i].sentiment | number        | Sentiment score for this trend at the given timestamp                                   |

Example Request:
```
GET https://senti.social/v1/%23NFLPlayoffs
```

Example Response:
```
{
  "name": "#NFLPlayoffs",
  "history": [
    {
      "timestamp": 1485381489296,
      "sentiment": 0.932
    },
    { "timestamp": 1485382360721
      sentiment: 0.876
    }
  ]
}
```

## GET /v1/trend/{name}/tweets

Get popular tweets related to the specified trend

Request parameters:

| Name                | Description                                                                                               |
|---------------------|-----------------------------------------------------------------------------------------------------------|
| max_id              | If set, returns tweets with an _id value less than _id. Otherwise response will start from the highest _id|
| limit               | If set, return no more than this many tweets                                                              |


Response:

| Name                 | Type          | Description                                                                             |
|----------------------|---------------|-----------------------------------------------------------------------------------------|
| tweets               | array         | Array of popular tweets for this trend                                                  |
| tweets[i]            | object        |                                                                                         |
| tweets[i]._id        | string        | Sequential unique identifier for tweets used for pagination                             |
| tweets[i].embed_id   | string        | Twitter id of tweet, used to embed it                                                   |

Example Request:
```
GET https://senti.social/v1/%23somesportsgame?limit=2&max_id=587f91be59b3dffe61f901b7
```

Example Response:

```
{
  "tweets": [
    {
      "_id": "587f91be59b3dffe61f901b3",
      "embed_id": "821744049568413059"
    },
    {
      "_id": "587f91be59b3dffe61f901b1",
      "embed_id": "821704759409351744"
    }
  ],
}
```

## GET /v1/trends/{name}/articles

Get news articles related to the specified trend

Request parameters:

| Name                | Description                                                                                            |
|---------------------|--------------------------------------------------------------------------------------------------------|
| max_id              | If set, returns articles with an _id value than _id. Otherwise response will start from the highest _id|
| limit               | If set, return no more than this many tweets                                                           |

Response:

| Name                    | Type                    | Description                                                                        |
|-------------------------|--------------------------------------------------------------------------------------------------------------|
| articles                | array                   | Array of objects containing news articles, sorted by popularity of news source     |
| articles[i]             | object                  |                                                                                    |
| articles[i]._id         | string                  | Sequential unique identifier for news articles                                     |
| articles[i].title       | string                  | Article's headline                                                                 |
| articles[i].description | string                  | Article excerpt or description                                                     |
| articles[i].source      | string                  | Publishing organization of news article                                            |
| articles[i].link        | string                  | URL link to the article                                                            |
| articles[i].timestamp   | string                  | Unix timestamp in seconds of the publishing date                                   |
| articles[i].media       | string &#124; undefined | URL link to media associated with the article, can be undefined if no media exists |

Example Request:
```
GET https://senti.social/v1/%23Rio%20Olympics?limit=2&max_id=587f91be59b3dffe61f901bf
```

Example Response:

```
{
  "articles": [
    {
      "_id": 587f91be59b3dffe61f901bd,
      "title": For the Rio Olympic Games, There’s No Turning Back Now,
      "description": Despite protests and criticisms that the Summer Games do not
      belong in Brazil, a country struggling with political turmoil and economic
      collapse — not to mention the Zika virus — the competitions have begun:,
      "source": The New York Times,
      "link": https://www.nytimes.com/2016/08/07/sports/olympics/rio-2016-games-theres-no-turning-back-now.html?_r=0,
      "timestamp": 1470463200,
      "media": https://static01.nyt.com/images/2016/08/07/sports/olympics/07macur/07macur-superJumbo.jpg
    },
    {
      "_id": 587f91be59b3dffe61f901b8,
      "title": Rio Olympics 2016: Five things to watch out for as Games commence,
      "description": The athletes have arrived, the venues are ready and expectation is palpable as
      the sporting world awaits the commencement of the 31st Olympic Games, the first
      ever Olympiad to be staged in South America.
      "source": CNN,
      "link": http://edition.cnn.com/2016/08/04/sport/rio-olympics-2016-five-things-to-watch-friday/,
      "timestamp": 1470471142,
      "media": undefined
    }
  ]
```
