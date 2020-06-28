///<reference path="../../support/index.d.ts"/>

export const x = 0;

describe("login", () => {
	it("should login", () => {
		cy.loginAuth0();
		cy.visit("./app");
	});
});
