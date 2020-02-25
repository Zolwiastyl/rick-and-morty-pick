import React from "react";
import { Store, StoreProvider } from "./Store";
import { Fragment, useContext } from "react";

export default function App(): JSX.Element {
  const { state, dispatch } = React.useContext(Store);

  const fetchDataAction = async () => {
    const URL =
      "http://api.tvmaze.com/singlesearch/shows?q=rick-&-&morty&embeded=episodes";
    const data = await fetch(URL);
    const dataJSON = await data.json();
    return dispatch({
      type: "FETCH_DATA",
      payloads: dataJSON._embedded.episodes
    });
  };
  React.useEffect(() => {
    state.episodes.length === 0 && fetchDataAction();
  });

  return (
    <React.Fragment>
      <h1>Rick and Morty</h1>
      <p>Pick your favourite episode!</p>
    </React.Fragment>
  );
}
