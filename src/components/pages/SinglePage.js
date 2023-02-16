import { useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import "./singleComicPage.scss";
import xMen from "../../resources/img/x-men.png";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../services/MarvelService";

const SingleComicPage = () => {
  const { comicId, charId } = useParams();
  console.log(`comicId=${comicId} charId=${charId}`)

  const [comic, setComic] = useState(null);
  const [char, setChar] = useState(null);
  const { loading, error, getComic, getCharacter, clearError } =
    useMarvelService();

  useEffect(() => {
    updateData();
  }, [comicId, charId]);

  const updateData = () => {
    clearError();
    comicId
      ? getComic(comicId).then(setComic)
      : getCharacter(charId).then((char) => {
        console.log('loaded char = ' + JSON.stringify(char, null, 2))
        setChar(char)});
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content =
    !loading && !error && (comic || char) ? <View item={comic ? comic : char} /> : null;
    
  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

const View = ({ item }) => {
  console.log(JSON.stringify(item))
  const { description, pageCount, thumbnail, language, price } = item;
  const isComic = item.title;
  let name = isComic ? item.title : item.name;
  return (
    <div className="single-comic">
      <img src={thumbnail} alt={name} className="single-comic__img" />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{name}</h2>
        <p className="single-comic__descr">{description}</p>
        {pageCount ? <p className="single-comic__descr">{pageCount}</p> : null}
        {language ? (
          <p className="single-comic__descr">Language: {language}</p>
        ) : null}
        {price ? <div className="single-comic__price">{price}</div> : null}
      </div>
      {isComic ? (
        <NavLink to="/comics" className="single-comic__back">
          Back to all
        </NavLink>
      ) : null}
    </div>
  );
};

export default SingleComicPage;
