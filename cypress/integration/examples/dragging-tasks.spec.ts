///<reference path="../../support/index.d.ts"/>

import "@testing-library/cypress/add-commands";

export const x = 0;

describe("It can", () => {
	it("move tasks between groups", () => {
		cy.login(Cypress.env("auth_username"), Cypress.env("auth_password"))
			.then(() => {
				cy.url().should("eq", "http://localhost:3000/");
			})
			.server()
			.route("/tasks")
			.wait(4000)
			.visit("/app");
		cy.get(":nth-child(1) > .overflow-y-auto")
			.children()
			.should("have.length", 2)
			.wait(5000);
		cy.get('[data-testid="task to move"]').drag(
			":nth-child(2) > .overflow-y-auto"
		);

		cy.get(":nth-child(2) > .overflow-y-auto")
			.children()
			.should("have.length", 1);

		cy.get(":nth-child(1) > .overflow-y-auto")
			.children()
			.should("have.length", 1);

		cy.get('[data-testid="task to move"]').drag(
			":nth-child(1) > .overflow-y-auto"
		);
		cy.get("[data-testid=RefreshCcw] > .h-12").click().wait(4000);
		cy.get(":nth-child(1) > .overflow-y-auto")
			.children()
			.should("have.length", 2);
		cy.get(":nth-child(2) > .overflow-y-auto").children().should("not.exist");
	});
});
