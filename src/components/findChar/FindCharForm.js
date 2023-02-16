import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import * as Yup from "yup";

import "./findCharForm.scss";

import useMarvelService from "../services/MarvelService";

const FindCharForm = () => {
  const [char, setChar] = useState(null);
  const [showNotFound, setShowNotFound] = useState(false);

  const { loading, error, getCharacterByName } = useMarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
    console.log(`setting notFound=${Boolean(char === null)}`);
    setShowNotFound(char === null);
  };

  const onRequest = (name) => {
    getCharacterByName(name).then(onCharLoaded);
  };

  return (
    <div className="findChar__info">
      <Formik
        initialValues={{
          name: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string().required("The field is required!"),
        })}
        onSubmit={(values) => {
          // console.log(JSON.stringify(values, null, 2))}
          onRequest(values.name);
        }}
      >
        <Form>
          <p className="findChar__comics">Or find character by name</p>
          <div className="findChar__basics">
            <Field
              id="name"
              name="name"
              type="name"
              className="findChar__comics-input"
              placeholder="Enter name"
              onClick={() => setShowNotFound(false)}
            />

            <button className="button button__main" type="submit">
              <div className="inner">Find</div>
            </button>

            <div>
              <ErrorMessage
                className="findChar__error"
                name="name"
                component="div"
              />

              {char ? (
                <div className="findChar__founded">{`There is! Visit ${char.name} page?`}</div>
              ) : showNotFound ? (
                <div className="findChar__error">
                  The character was not found. Check the name and try again.
                </div>
              ) : null}
            </div>

            {char ? (
              // <div className="button button__secondary">
                <NavLink to={`/chars/${char.id}`} className="button button__secondary">
                  <div className="inner">Page</div>
                </NavLink>
              // </div>
            ) : // <a className="button button__secondary">
            //   <div className="inner">Page</div>
            // </a>
            null}
          </div>
        </Form>
      </Formik>
    </div>
  );
};
export default FindCharForm;
