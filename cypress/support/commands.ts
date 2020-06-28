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

Cypress.Commands.add("dataCy", (value) => {
	return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add("login", (overrides = {}) => {
	Cypress.log({
		name: "loginViaAuth0",
	});
	Cypress.log({
		name: Cypress.env("auth_username"),
	});
	const options = {
		method: "POST",
		url: Cypress.env("auth_url"),
		body: {
			grant_type: "password",
			username: Cypress.env("auth_username"),
			password: Cypress.env("auth_password"),
			audience: Cypress.env("auth_audience"),
			scope: "openid profile email",
			client_id: Cypress.env("auth_client_id"),
			client_secret: Cypress.env("auth_client_secret"),
		},
	};
	cy.request(options);
});

Cypress.Commands.add("loginAuth0", (overrides = {}) => {
	Cypress.log({
		name: "Login to Auth0",
	});
	const webAuth = new auth0.WebAuth({
		domain: Cypress.env("auth_url"),
		clientID: Cypress.env("auth_client_id"),
		responseType: "token id_token",
	});

	webAuth.client.login(
		{
			realm: "Username-Password-Authentication",
			username: Cypress.env("auth_username"),
			password: Cypress.env("auth_password"),
			audience: Cypress.env("auth_audience"),
			scope: "openid profile email",
		},
		(err, authResult) => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				const token = {
					accessToken: authResult.accessToken,
					idToken: authResult.idToken,
					expiresAt: authResult.expiresAt * 1000 + new Date().getTime(),
				};
				window.sessionStorage.setItem(
					"wirem:storage_token",
					JSON.stringify(token)
				);
			} else {
				console.error("Problem logging into Auth0", err);
			}
		}
	);
});

Cypress.Commands.add("removeTokenFromStorage", (overrides = {}) => {
	cy.visit("/app", {
		onBeforeLoad: (win) => {
			win.sessionStorage.clear();
		},
	});
});
