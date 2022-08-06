import React from "react";
import "./App.css";
import Pagination from "./Pagination";

async function searchNews(q) {
  q = encodeURIComponent(q);
  const response = await fetch(
    `https://bing-news-search1.p.rapidapi.com/news/search?freshness=Day&textFormat=Raw&safeSearch=Strict&q=${q}`,
    {
      method: "GET",
      headers: {
        "X-BingApis-SDK": "true",
        "X-RapidAPI-Key": "f7e8bf3326msh1dc8b4895930185p1ccbabjsn3b7932fa7911",
        "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
        count: 17,
      },
    }
  );
  const body = await response.json();
  return body.value;
}

function App() {
  const [query, setQuery] = React.useState("docker");
  const [list, setList] = React.useState(null);

  const search = (e) => {
    e.preventDefault();
    searchNews(query).then(setList);
  };

  return (
    <div className="app">
      <form onSubmit={search}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button>Search</button>
      </form>

      {!list ? null : list.length === 0 ? (
        <p>
          <i>No results</i>
        </p>
      ) : (
        <React.Fragment>
          <ul>
            {list.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </ul>
          <Pagination />
        </React.Fragment>
      )}
    </div>
  );
}

function Item({ item }) {
  const separateWords = (s) => s.replace(/[A-Z][a-z]+/g, "$& ").trim();
  const formatDate = (s) =>
    new Date(s).toLocaleDateString(undefined, { dateStyle: "long" });

  return (
    <li className="item">
      {item.image && (
        <a href={item.url} target="_blank" rel="noreferrer">
          <img
            className="thumbnail"
            alt=""
            src={item.image?.thumbnail?.contentUrl}
          />
        </a>
      )}

      <h2 className="title">
        <a href={item.url} target="_blank" rel="noreferrer">
          {item.name}
        </a>
      </h2>

      <p className="description">{item.description}</p>

      <div className="meta">
        <span>{formatDate(item.datePublished)}</span>

        <span className="provider">
          {item.provider[0].image?.thumbnail && (
            <img
              className="provider-thumbnail"
              alt=""
              src={item.provider[0].image.thumbnail.contentUrl + "&w=16&h=16"}
            />
          )}
          {item.provider[0].name}
        </span>

        {item.category && <span>{separateWords(item.category)}</span>}
      </div>
    </li>
  );
}

export default App;
