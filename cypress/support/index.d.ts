///<reference path="cypress"/>

declare namespace Cypress {
	interface Chainable {
		dataCy(value: string): Chainable<Element>;
		login(): Chainable<Cypress.Response>;
		loginAuth0(): Chainable<Element>;
	}
}
