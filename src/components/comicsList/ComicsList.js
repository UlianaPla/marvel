import "./comicsList.scss";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case "waiting":
      return <Spinner />;
      break;
    case "loading":
      return newItemLoading ? <Component /> : <Spinner />;
      break;
    case "confirmed":
      return <Component />;
      break;
    case "error":
      return <ErrorMessage />;
      break;
    default:
      throw new Error("Unexpected process state");
  }
};

const ComicsList = () => {
  const [comics, setComics] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { getAllComics, process, setProcess } =
    useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []); // [] - функция вьіполнится только один раз (imitation of ComponentDidMount)

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);

    getAllComics(offset)
      .then(onComicsLoaded)
      .then(() => setProcess("confirmed"));
  };

  const onComicsLoaded = (newComics) => {
    let ended = false;
    if (newComics.length < 8) {
      ended = true;
    }

    setComics((comics) => [...comics, ...newComics]);
    setNewItemLoading(false);
    setOffset((offset) => offset + 8);
    setComicsEnded(ended);
  };

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      return (
        <li className="comics__item" tabIndex={0} key={i}>
          <NavLink to={`/comics/${item.id}`}>
            <img
              src={item.thumbnail}
              alt={item.title}
              className="comics__item-img"
            />
            <div className="comics__item-name">{item.title}</div>
            <div className="comics__item-price">{item.price}</div>
          </NavLink>
        </li>
      );
    });

    return <ul className="comics__grid">{items}</ul>;
  }

  return (
    <div className="comics__list">
      {setContent(process, () => renderItems(comics), newItemLoading)}

      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        onClick={() => onRequest(offset, false)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
