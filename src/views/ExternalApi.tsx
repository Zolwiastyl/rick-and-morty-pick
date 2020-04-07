import React, { useState } from "react";

// src/views/ExternalApi.js

import { useAuth0 } from "../react-auth0-spa";
import { HOST } from "../api";

const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const { client } = useAuth0();

  const callApi = async () => {
    try {
      const token = await client?.getTokenSilently();

      const response = await fetch(HOST + "/external-api", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>External API</h1>
      <button onClick={callApi}>Ping API</button>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
    </>
  );
};

export default ExternalApi;
