import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";

interface AuthContextValue {
  client: Auth0Client | undefined;
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  popupOpen: boolean;
  handleRedirectCallback: () => Promise<void>;
  loginWithPopup: Auth0Client["loginWithPopup"];
}

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext<AuthContextValue | undefined>(
  undefined
);
export const useAuth0 = () => {
  const ctxValue = useContext(Auth0Context);
  if (ctxValue == undefined)
    throw new Error("useAuth can only be used inside AuthProvider");
  return ctxValue;
};
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState<Auth0Client | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const initAuth0 = async () => {
      setLoading(true);
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);
      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        console.log(appState);

        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (
    params?: PopupLoginOptions,
    config?: PopupConfigOptions
  ) => {
    setPopupOpen(true);
    try {
      await auth0Client?.loginWithPopup(params, config);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client?.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client?.handleRedirectCallback();
    const user = await auth0Client?.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        client: auth0Client
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
