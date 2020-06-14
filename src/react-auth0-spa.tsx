import createAuth0Client, {
	Auth0ClientOptions,
	PopupConfigOptions,
	PopupLoginOptions,
} from "@auth0/auth0-spa-js";
import Auth0Client from "@auth0/auth0-spa-js/dist/typings/Auth0Client";
import React, { useContext, useEffect, useState } from "react";

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
	console.log({ ctxValue });
	if (!ctxValue)
		throw new Error("useAuth can only be used inside AuthProvider");

	return ctxValue;
};
interface Auth0ProviderProps {
	children: React.ReactNode;
	onRedirectCallback: (appState: { targetUrl: string }) => void;
	options: Auth0ClientOptions;
}

export const Auth0Provider = ({
	children,
	onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
	options,
}: Auth0ProviderProps) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState();
	const [auth0Client, setAuth0] = useState<Auth0Client | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [popupOpen, setPopupOpen] = useState<boolean>(false);

	useEffect(() => {
		const initAuth0 = async () => {
			setLoading(true);
			const auth0Instance = await createAuth0Client(options);
			setAuth0(auth0Instance);
			if (
				window.location.search.includes("code=") &&
				window.location.search.includes("state=")
			) {
				const { appState } = await auth0Instance.handleRedirectCallback();

				onRedirectCallback(appState);
			}

			const isAuthenticated = await auth0Instance.isAuthenticated();

			setIsAuthenticated(isAuthenticated);

			if (isAuthenticated) {
				const user = await auth0Instance.getUser();
				setUser(user);
			}

			setLoading(false);
		};
		initAuth0();
	}, [options, onRedirectCallback]);

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
				client: auth0Client,
			}}
		>
			{children}
		</Auth0Context.Provider>
	);
};
