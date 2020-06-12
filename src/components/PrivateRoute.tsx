// src/components/PrivateRoute.js

import React, { useEffect } from "react";
import { Route } from "react-router-dom";

import { useAuth0 } from "../react-auth0-spa";

export const PrivateRoute = ({ component: Component, path, ...rest }: any) => {
  const { loading, isAuthenticated, client } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated || !client?.loginWithRedirect) {
      return;
    }

    const fn = async () => {
      await client.loginWithRedirect({
        appState: { targetUrl: window.location.pathname }
      });
    };
    fn();
  }, [loading, isAuthenticated, path, client]);

  const render = (props: any) =>
    isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};
