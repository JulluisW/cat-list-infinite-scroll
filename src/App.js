import axios from "axios";
import { useEffect, useState } from "react";
import "./App.scss";

function App() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  // const [detailIndex, setDetailIndex] = useState([false]);
  const limit = 10;

  // const toggle = (index) => {
  //   if (detailIndex === index) {
  //     return setDetailIndex(null);
  //   }
  //   setDetailIndex(index);
  // };

  const onHandleSearch = (query) => {
    axios({
      method: "GET",
      url: "https://api.thecatapi.com/v1/breeds/Search",
      headers: { "x-api-key": "092d5846-b683-4d10-9831-78ac2e89cc75" },
      params: { q: query },
    })
      .then((res) => {
        setCats((prevCats) => {
          return res.data;
        });
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  };

  const infiniteScrollTrigger = () => {
    setPage((prevPage) => {
      return prevPage + 1;
    });
  };

  window.onscroll = function () {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      infiniteScrollTrigger();
    }
  };

  useEffect(() => {
    setLoading(true);
    let cancel;
    axios({
      method: "GET",
      url: "https://api.thecatapi.com/v1/breeds",
      params: { page, limit },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setCats((prevCats) => {
          return [...prevCats, ...res.data];
        });
      })
      .catch(() => null)
      .finally(() => setLoading(false));

    return () => cancel();
  }, [page]);

  return (
    <div className="App">
      <div className="container">
        <h1>List of Cats</h1>
        <input onChange={(e) => onHandleSearch(e.target.value)} />
        {cats.map((cat, index) => {
          //Expanded TYPE
          return <Card key={cat.id} cat={cat} index={index} />;

          // Accordion TYPE
          // return (
          //   <div className="card" key={cat.name}>
          //     <img className="profile-image" src={cat.image?.url} alt={cat.name} />
          //     <div className="card-detail">
          //       <p>No : {index + 1}</p>
          //       <p>ID : {cat.id}</p>
          //       <p>Name : {cat.name}</p>
          //     </div>
          //     <div className="card-expansion">
          //       <button type="button" onClick={() => toggle(index)} className="button">
          //         {detailIndex === index ? "Close" : "Expand"}
          //       </button>
          //       {detailIndex === index ? (
          //         <>
          //           <p>Origin : {cat.origin ? cat.origin : "-"}</p>
          //           <p>Temprament : {cat.temperament ? cat.temperament : "-"}</p>
          //           <p>Alt Name : {cat.alt_names ? cat.alt_names : "-"}</p>
          //           <p>Origin : {cat.country_codes ? cat.country_codes : "-"}</p>
          //         </>
          //       ) : null}
          //     </div>
          //   </div>
          // );
        })}
        {cats.length === 0 ? <h1>Error - CAT NOT FOUND</h1> : null}
      </div>
    </div>
  );
}

function Card({ cat, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="card">
      <img className="profile-image" src={cat.image?.url} alt={cat.name} />
      <div className="card-detail">
        <p>No : {index + 1}</p>
        <p>ID : {cat.id}</p>
        <p>Name : {cat.name}</p>
      </div>
      <div className="card-expansion">
        <button type="button" onClick={() => setIsExpanded((prev) => !prev)} className="button">
          {isExpanded ? "Close" : "Expand"}
        </button>
        {isExpanded ? (
          <>
            <p>Origin : {cat.origin ? cat.origin : "-"}</p>
            <p>Temprament : {cat.temperament ? cat.temperament : "-"}</p>
            <p>Alt Name : {cat.alt_names ? cat.alt_names : "-"}</p>
            <p>Origin : {cat.country_codes ? cat.country_codes : "-"}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
