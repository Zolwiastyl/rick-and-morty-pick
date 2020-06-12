import "../styles/profile.scss";

import React, { Fragment } from "react";

import { useAuth0 } from "../react-auth0-spa";

export const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <img
        style={{ width: "20px" }}
        className="user-picure"
        src={user.picture}
        alt="Profile"
      />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </Fragment>
  );
};
