import { useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import "./singleComicPage.scss";

import AppBanner from "../appBanner/AppBanner";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../services/MarvelService";

const SingleCharPage = () => {
  const params = useParams();
  console.log(params)
  const { charId } = useParams();

  const [char, setChar] = useState(null);
  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [charId]);

  const updateChar = () => {
    clearError();
    getCharacter(charId).then(onCharLoaded);
  };

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !loading && !error && char ? <View char={char} /> : null;

  return (
    <>
      <AppBanner />
      {errorMessage}
      {spinner}
      {content}
    </>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail } = char;
  return (
    <div className="single-comic">
      <img src={thumbnail} alt={name} className="single-comic__img" />
      <div className="single-comic__info">
        <h2 className="single-comic__name">{name}</h2>
        <p className="single-comic__descr">{description}</p>
      </div>
    </div>
  );
};

export default SingleCharPage;
