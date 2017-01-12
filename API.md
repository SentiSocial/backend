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
    <td><a href="#v1-alltrends-content"><code>/v1/alltrends/content?page={page}</code></a></td>
    <td>Get news and tweets for all trends</td>
  </tr>
  <tr>
    <td><strong>GET</strong></td>
    <td><a href="#v1-trend-name"><code>/v1/trend/{name}</code></a></td>
    <td>Get historical data for the specified trend</td>
  </tr>
  <tr>
    <td><strong>GET</strong></td>
    <td><a href="#v1-trend-name-content"><code>/v1/trend/{name}/content?page={page}</code></a></td>
    <td>Get news and tweets for the specified trend</td>
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

<h2>GET /v1/alltrends/content</h2>
<a id="v1-alltrends-content"></a>

<table>
  <tr>
    <td><strong>GET</strong></td>
    <td colspan="2">/v1/alltrends/content?page={page}</code></td>
  </tr>
  <tr>
    <td colspan="3">Get news and tweets for all trends</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Parameters</strong></td>
  </tr>
  <tr>
    <td>page</td>
    <td>string</td>
    <td>Zero indexed page number</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Response</strong></td>
  </tr>
  <tr>
    <td>news</td>
    <td>array</td>
    <td>Array of objects containing news, sorted by popularity of news source</td>
  </tr>
  <tr>
    <td>news[i]</td>
    <td>object</td>
    <td></td>
  </tr>
  <tr>
    <td>news[i].title</td>
    <td>string</td>
    <td>Article's headline</td>
  </tr>
  <tr>
    <td>news[i].description</td>
    <td>string</td>
    <td>Article excerpt or description</td>
  </tr>
  <tr>
    <td>news[i].source</td>
    <td>string</td>
    <td>Publishing organization of news article</td>
  </tr>
  <tr>
    <td>news[i].link</td>
    <td>string</td>
    <td>URL link to the article</td>
  </tr>
  <tr>
    <td>news[i].timestamp</td>
    <td>string</td>
    <td>Unix timestamp in seconds of the publishing date</td>
  </tr>
  <tr>
    <td>news[i].media</td>
    <td>string|undefined</td>
    <td>URL link to media associated with the article</td>
  </tr>
  <tr>
    <td>tweets[i]</td>
    <td>object</td>
    <td></td>
  </tr>
  <tr>
    <td>tweets[i].id</td>
    <td>string</td>
    <td>Unique identifier of the tweet used to <a href="https://dev.twitter.com/web/embedded-tweets">embed</a> it</td>
  </tr>
  <tr>
    <td>remaining</td>
    <td>number</td>
    <td>Number of news articles and tweets remaining in all pages after the specified page</td>
  </tr>
</table>

<pre>
{
  "news": [
    {
      "title": string,
      "description": string,
      "source": string,
      "link": string,
      "timestamp": number,
      "media": string|undefined
    }
  ],
  "tweets": [
    {
      "id": string
    }
  ],
  "remaining": number
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
    <td colspan="3">Get historical data for the specified trend</td>
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

<h2>GET /v1/trend/{name}/content</h2>
<a id="v1-trend-name-content"></a>

<table>
  <tr>
    <td><strong>GET</strong></td>
    <td colspan="2">/v1/trend/{name}/content?page={page}</code></td>
  </tr>
  <tr>
    <td colspan="3">Get news and tweets for the specified trend</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Parameters</strong></td>
  </tr>
  <tr>
    <td>name</td>
    <td>string</td>
    <td>Trend name from the <code>/trends</code> endpoint</td>
  </tr>
  <tr>
    <td>page</td>
    <td>string</td>
    <td>Page number, starts counting from 0</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3"><strong>Response</strong></td>
  </tr>
  <tr>
    <td>news</td>
    <td>array</td>
    <td>Array of objects containing timestamp and sentiment, sorted oldest first</td>
  </tr>
  <tr>
    <td>news[i]</td>
    <td>object</td>
    <td></td>
  </tr>
  <tr>
    <td>news[i].title</td>
    <td>string</td>
    <td>Article's headline</td>
  </tr>
  <tr>
    <td>news[i].description</td>
    <td>string</td>
    <td>Article excerpt or description</td>
  </tr>
  <tr>
    <td>news[i].source</td>
    <td>string</td>
    <td>Article source, which organization it belongs to</td>
  </tr>
  <tr>
    <td>news[i].link</td>
    <td>string</td>
    <td>URL link to the article</td>
  </tr>
  <tr>
    <td>news[i].timestamp</td>
    <td>string</td>
    <td>Unix timestamp in seconds of the publishing date</td>
  </tr>
  <tr>
    <td>news[i].media</td>
    <td>string|undefined</td>
    <td>URL link to media associated with the article</td>
  </tr>
  <tr>
    <td>tweets[i]</td>
    <td>object</td>
    <td></td>
  </tr>
  <tr>
    <td>tweets[i].id</td>
    <td>string</td>
    <td>Unique identifier of the tweet used to <a href="https://dev.twitter.com/web/embedded-tweets">embed</a> it</td>
  </tr>
  <tr>
    <td>remaining</td>
    <td>number</td>
    <td>Number of news articles and tweets remaining in all pages after the specified page</td>
  </tr>
</table>

<pre>
{
  "news": [
    {
      "title": string,
      "description": string,
      "source": string,
      "link": string,
      "timestamp": number,
      "media": string|undefined
    }
  ],
  "tweets": [
    {
      "id": string
    }
  ],
  "remaining": number
}
</pre>

<a href="#summary">Back to summary</a>
