<h1>Trend Gator API</h1>

<h2>Summary</h2>

<table>
  <tr>
    <td><strong>GET</strong></td>
    <td><a href="#v1-alltrends"><code>/v1/alltrends</code></a></td>
    <td>Get all current trends and data associated with each one</td>
  </tr>
  <tr>
    <td><strong>GET</strong></td>
    <td><a href="#v1-alltrends-tweets"><code>/v1/alltrends/tweets</code></a></td>
    <td>Get tweets related to all trends</td>
  </tr>
  <tr>
    <td><strong>GET</strong></td>
    <td><a href="#v1-alltrends-articles"><code>/v1/alltrends/articles</code></a></td>
    <td>Get news articles related to all trends</td>
  </tr>
  <tr>
    <td><strong>GET</strong></td>
    <td><a href="#v1-trend-name"><code>/v1/trend/{name}</code></a></td>
    <td>Get data for the specified trend</td>
  </tr>
  <tr>
    <td><strong>GET</strong></td>
    <td><a href="#v1-trend-name-tweets"><code>/v1/trend/{name}/tweets</code></a></td>
    <td>Get tweets related to the specified trend</td>
  </tr>
  <tr>
    <td><strong>GET</strong></td>
    <td><a href="#v1-trend-name-articles"><code>/v1/trend/{name}/articles</code></a></td>
    <td>Get news articles related to the specified trend</td>
  </tr>
</table>

<h2>GET /v1/alltrends</h2>
<a id="v1-alltrends"></a>

<table>
  <tr>
    <td><strong>GET</strong></td>
    <td colspan="2"><code>/v1/alltrends</code></td>
  </tr>
  <tr>
    <td colspan="3">Get all current trends and data associated with each one</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Response</strong></td>
  </tr>
  <tr>
    <td>trends</td>
    <td>array</td>
    <td>Array of trends sorted most popular first</td>
  </tr>
  <tr>
    <td>trends[i]</td>
    <td>object</td>
    <td></td>
  </tr>
  <tr>
    <td>trends[i].name</td>
    <td>string</td>
    <td>Name of the trend, used as a parameter in <code>/trends/{name}</code></td>
  </tr>
  <tr>
    <td>trends[i].sentiment</td>
    <td>number</td>
    <td>Sentiment score at a given timestamp, higher numbers indicate a more positive sentiment</td>
  </tr>
</table>

<pre>
{
  "trends": [
    {
      "name": string,
      "sentiment": number
    }
  ]
}
</pre>

<a href="#summary">Back to summary</a>

<h2>GET /v1/alltrends/tweets</h2>
<a id="v1-alltrends-tweets"></a>

<table>
  <tr>
    <td><strong>GET</strong></td>
    <td colspan="2">/v1/alltrends/tweets</code></td>
  </tr>
  <tr>
    <td colspan="3">Get tweets related to all trends</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Parameters</strong></td>
  </tr>
  <tr>
    <td>max_id</td>
    <td>string|undefined</td>
    <td>If set, returns tweets less than <code>_id</code>. Otherwise response will start from the highest <code>_id</code></td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Response</strong></td>
  </tr>
  <tr>
    <td>tweets[i]</td>
    <td>object</td>
    <td></td>
  </tr>
  <tr>
    <td>tweets[i]._id</td>
    <td>string</td>
    <td>Sequential unique identifier for tweets</td>
  </tr>
  <tr>
    <td>tweets[i].embed_id</td>
    <td>string</td>
    <td>Unique identifier of the tweet used to <a href="https://dev.twitter.com/web/embedded-tweets">embed</a> it</td>
  </tr>
</table>

<pre>
{
  "tweets": [
    {
      "_id": string,
      "embed_id": string
    }
  ]
}
</pre>

<a href="#summary">Back to summary</a>

<h2>GET /v1/alltrends/articles</h2>
<a id="v1-alltrends-articles"></a>

<table>
  <tr>
    <td><strong>GET</strong></td>
    <td colspan="2">/v1/alltrends/articles</code></td>
  </tr>
  <tr>
    <td colspan="3">Get news articles related to all trends</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Parameters</strong></td>
  </tr>
  <tr>
    <td>max_id</td>
    <td>string|undefined</td>
    <td>If set, returns articles less than <code>_id</code>. Otherwise response will start from the highest <code>_id</code></td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Response</strong></td>
  </tr>
  <tr>
    <td>articles</td>
    <td>array</td>
    <td>Array of objects containing news articles, sorted by popularity of news source</td>
  </tr>
  <tr>
    <td>articles[i]</td>
    <td>object</td>
    <td></td>
  </tr>
  <tr>
    <td>articles[i]._id</td>
    <td>string</td>
    <td>Sequential unique identifier for news articles</td>
  </tr>
  <tr>
    <td>articles[i].title</td>
    <td>string</td>
    <td>Article's headline</td>
  </tr>
  <tr>
    <td>articles[i].description</td>
    <td>string</td>
    <td>Article excerpt or description</td>
  </tr>
  <tr>
    <td>articles[i].source</td>
    <td>string</td>
    <td>Publishing organization of news article</td>
  </tr>
  <tr>
    <td>articles[i].link</td>
    <td>string</td>
    <td>URL link to the article</td>
  </tr>
  <tr>
    <td>articles[i].timestamp</td>
    <td>string</td>
    <td>Unix timestamp in seconds of the publishing date</td>
  </tr>
  <tr>
    <td>articles[i].media</td>
    <td>string|undefined</td>
    <td>URL link to media associated with the article</td>
  </tr>
</table>

<pre>
{
  "articles": [
    {
      "_id": string,
      "title": string,
      "description": string,
      "source": string,
      "link": string,
      "timestamp": number,
      "media": string|undefined
    }
  ]
}
</pre>

<a href="#summary">Back to summary</a>

<h2>GET /v1/trend/{name}</h2>
<a id="v1-trend-name"></a>

<table>
  <tr>
    <td><strong>GET</strong></td>
    <td colspan="2"><code>/v1/trend/{name}</code></td>
  </tr>
  <tr>
    <td colspan="3">Get data for the specified trend</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Parameters</strong></td>
  </tr>
  <tr>
    <td>name</td>
    <td>string</td>
    <td>Trend name from the <code>/alltrends</code> endpoint</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Response</strong></td>
  </tr>
  <tr>
    <td>name</td>
    <td>string</td>
    <td>Trend name echoed back</td>
  </tr>
  <tr>
    <td>history</td>
    <td>array</td>
    <td>Array of objects containing timestamp and sentiment, sorted oldest first</td>
  </tr>
  <tr>
    <td>history[i]</td>
    <td>object</td>
    <td></td>
  </tr>
  <tr>
    <td>history[i].timestamp</td>
    <td>number</td>
    <td>Unix timestamp in seconds</td>
  </tr>
  <tr>
    <td>history[i].sentiment</td>
    <td>number</td>
    <td>Sentiment at a given time</td>
  </tr>
</table>

<pre>
{
  "name": string,
  "history": [
    {
      "timestamp": number,
      "sentiment": number
    }
  ]
}
</pre>

<a href="#summary">Back to summary</a>

<h2>GET /v1/trend/{name}/tweets</h2>
<a id="v1-trend-name-tweets"></a>

<table>
  <tr>
    <td><strong>GET</strong></td>
    <td colspan="2">/v1/trend/{name}/tweets</code></td>
  </tr>
  <tr>
    <td colspan="3">Get tweets related to the specified trend</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Parameters</strong></td>
  </tr>
  <tr>
    <td>name</td>
    <td>string</td>
    <td>Trend name from the <code>/alltrends</code> endpoint</td>
  </tr>
  <tr>
    <td>max_id</td>
    <td>string|undefined</td>
    <td>If set, returns tweets less than <code>_id</code>. Otherwise response will start from the highest <code>_id</code></td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Response</strong></td>
  </tr>
  <tr>
    <td>tweets[i]</td>
    <td>object</td>
    <td></td>
  </tr>
  <tr>
    <td>tweets[i]._id</td>
    <td>string</td>
    <td>Sequential unique identifier for tweets</td>
  </tr>
  <tr>
    <td>tweets[i].embed_id</td>
    <td>string</td>
    <td>Unique identifier of the tweet used to <a href="https://dev.twitter.com/web/embedded-tweets">embed</a> it</td>
  </tr>
</table>

<pre>
{
  "tweets": [
    {
      "_id": string,
      "embed_id": string
    }
  ],
}
</pre>

<a href="#summary">Back to summary</a>

<h2>GET /v1/trend/{name}/articles</h2>
<a id="v1-trend-name-articles"></a>

<table>
  <tr>
    <td><strong>GET</strong></td>
    <td colspan="2">/v1/trend/{name}/articles</code></td>
  </tr>
  <tr>
    <td colspan="3">Get news articles related to the specified trend</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Parameters</strong></td>
  </tr>
  <tr>
    <td>name</td>
    <td>string</td>
    <td>Trend name from the <code>/alltrends</code> endpoint</td>
  </tr>
  <tr>
    <td>max_id</td>
    <td>string|undefined</td>
    <td>If set, returns articles less than <code>_id</code>. Otherwise response will start from the highest <code>_id</code>.</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Response</strong></td>
  </tr>
  <tr>
    <td>articles</td>
    <td>array</td>
    <td></td>
  </tr>
  <tr>
    <td>articles[i]</td>
    <td>object</td>
    <td></td>
  </tr>
  <tr>
    <td>articles[i]._id</td>
    <td>string</td>
    <td>Sequential unique identifier for news articles</td>
  </tr>
  <tr>
    <td>articles[i].title</td>
    <td>string</td>
    <td>Article's headline</td>
  </tr>
  <tr>
    <td>articles[i].description</td>
    <td>string</td>
    <td>Article excerpt or description</td>
  </tr>
  <tr>
    <td>articles[i].source</td>
    <td>string</td>
    <td>Article source, which organization it belongs to</td>
  </tr>
  <tr>
    <td>articles[i].link</td>
    <td>string</td>
    <td>URL link to the article</td>
  </tr>
  <tr>
    <td>articles[i].timestamp</td>
    <td>string</td>
    <td>Unix timestamp in seconds of the publishing date</td>
  </tr>
  <tr>
    <td>articles[i].media</td>
    <td>string|undefined</td>
    <td>URL link to media associated with the article</td>
  </tr>
</table>

<pre>
{
  "articles": [
    {
      "_id": string,
      "title": string,
      "description": string,
      "source": string,
      "link": string,
      "timestamp": number,
      "media": string|undefined
    }
  ]
}
</pre>

<a href="#summary">Back to summary</a>