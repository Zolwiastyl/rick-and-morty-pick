///<reference path="cypress"/>

declare namespace Cypress {
	interface Chainable {
		dataCy(value: string): Chainable<Element>;

		loginAuth0(): Chainable<Element>;
		removeTokenFromStorage(): Chainable<Element>;

		login(
			username: string,
			password: string,
			appState?: any
		): Chainable<Subject>;
	}
}
