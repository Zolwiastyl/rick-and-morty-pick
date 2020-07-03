Cypress.Commands.add(
	"login",
	(username, password, appState = { target: "/" }) => {
		Cypress.log({
			name: "loginViaAuth0",
		});
		cy.log(`Logging in as ${Cypress.env("auth_username")}`);

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
		cy.request(options).then(({ body }) => {
			const { access_token, expires_in, id_token, auth_username } = body;
			window.localStorage.setItem("TOken", JSON.stringify({ body }));
			window.localStorage.setItem("TOken", "JSON.stringify({ body })");
			cy.server();
			cy.route({
				url: "ouath/token",
				method: "POST",
				response: {
					access_token: access_token,
					expires_in: expires_in,
					id_token: id_token,
					token_type: "Bearer",
					scope: "openid profile email",
				},
			});
			const stateId = "test";
			const encodedAppState = encodeURI(JSON.stringify(appState));
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
			);
			cy.setCookie("auth0.is.aunthenticated", "true");
			window.localStorage.setItem(
				`@@auth0spajs@@::${Cypress.env(
					"auth_client_id"
				)}::default::openid profile email`,

				JSON.stringify({ access_token, id_token })
			);

			const callbackUrl = `/auth/callback?code=test-code&state=${stateId}`;
			return cy.visit(callbackUrl);
		});
	}
);
