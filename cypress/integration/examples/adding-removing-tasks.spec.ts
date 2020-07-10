///<reference path="../../support/index.d.ts"/>

import "@testing-library/cypress/add-commands";

export const x = 0;

describe("basic user flow works", () => {
	Cypress.on("uncaught:exception", (error) => {
		cy.log(error.message);
	});
	it("it gets token and logs in", () => {
		cy.visit("/")
			.login(Cypress.env("auth_username"), Cypress.env("auth_password"))
			.then(() => {
				cy.url()
					.should("eq", "http://localhost:3000/")
					.log("still loged in");
			})

			.visit("/app")
			.wait(5000);

		cy.server().route("/tasks");

		expect(cy.contains("old task"));
	});
	it("ads and removes task", () => {
		cy.login(Cypress.env("auth_username"), Cypress.env("auth_password"))
			.then(() => {
				cy.url().should("eq", "http://localhost:3000/");
			})
			.visit("/app")
			.server()
			.route("/tasks")
			.wait(5000);
		cy.get("[data-testid=ChevronsRight]")
			.click()
			.focused()
			.type("new task")
			.type(`{enter}`);
		expect(cy.contains("new task"));
		cy.wait(5000)
			.get('[data-testid="new task remove"] > svg')
			.click()
			.wait(2000);
		cy.get('[data-testid="new task"] > .flex > .p-1').should("not.exist");
		cy.get("[data-testid=ChevronsLeft]").click();
		cy.get("input").should("not.exist");
	});
});
