import "@testing-library/cypress/add-commands";
import "@4tw/cypress-drag-drop";

import auth0 from "auth0-js";
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

export const x = 0;

Cypress.Commands.add(
	"login",
	(username, password, appState = { targetUrl: "/" }) => {
		try {
			cy.log(`Logging in as ${username}`);
			const options = {
				method: "POST",
				url: Cypress.env("auth_url"),
				body: {
					grant_type: "password",
					username: username,
					password: password,
					audience: Cypress.env("auth_audience"),
					scope: "openid profile email",
					client_id: Cypress.env("auth_client_id"),
					client_secret: Cypress.env("auth_client_secret"),
				},
			};
			cy.request(options).then(({ body }) => {
				const { access_token, expires_in, id_token } = body;

				cy.server();

				cy.route({
					url: "oauth/token",
					method: "POST",
					response: {
						access_token: access_token,
						id_token: id_token,
						scope: "openid profile email",
						expires_in: expires_in,
						token_type: "Bearer",
					},
				});

				const stateId = "test";

				cy.setCookie(
					`a0.spajs.txs.${stateId}`,
					encodeURIComponent(
						JSON.stringify({
							appState: appState,
							scope: "openid profile email",
							audience: "default",
							redirect_uri: "http://localhost:3000",
						})
					)
				).then(() => {
					cy.log("visiting code= state=");
					cy.visit(`/?code=test-code&state=${stateId}`);
				});
			});
		} catch (error) {
			cy.log(error);
		}
	}
);

Cypress.Commands.add("loginAuth0", (overrides = {}) => {
	Cypress.log({
		name: "Login to Auth0",
	});
	const webAuth = new auth0.WebAuth({
		domain: Cypress.env("auth_domain"),
		clientID: Cypress.env("auth_client_id"),
		responseType: "token id_token",
	});

	webAuth.client.login(
		{
			realm: "Username-Password-Authentication",
			username: Cypress.env("auth_username"),
			password: Cypress.env("auth_password"),
			audience: Cypress.env("auth_audience"),
			scope: "openid email profile",
		},
		(err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				const token = {
					accessToken: authResult?.accessToken,
					idToken: authResult?.idToken,
					expiresAt: authResult?.expiresAt * 1000 + new Date().getTime(),
				};

				window.sessionStorage.setItem(
					`@@auth0spajs@@::${Cypress.env(
						"auth_client_id"
					)}::default::openid profile email`,
					JSON.stringify(token)
				);
				window.localStorage.setItem("something", "more	");
				Cypress.log({
					name: "success",
				});
			} else {
				console.error(
					"Problem logging in Auth0 ",
					err?.statusText,
					" ",
					err?.statusCode
				);
				throw err;
			}
		}
	);

	Cypress.Commands.add("dataCy", (value) => {
		cy.get(`[data-cy=${value}]`);
	});
});

Cypress.Commands.add("removeTokenFromStorage", (overrides = {}) => {
	cy.visit("/", {
		onBeforeLoad: (win) => {
			win.sessionStorage.clear();
		},
	});
});
