///<reference path="../../support/index.d.ts"/>

import "@testing-library/cypress/add-commands";

import { screen, waitFor } from "@testing-library/react";

export const x = 0;

describe("basic user flow works", () => {
	it("it gets token and logs in", () => {
		cy.visit("/")
			.login(Cypress.env("auth_username"), Cypress.env("auth_password"))
			.then(() => {
				cy.url()
					.should("eq", "http://localhost:3000/")
					.log("still loged in");
			})

			.visit("/app")
			.server()
			.route("/tasks");
		expect(cy.contains("old task"));

		// cy.get("button")
		// .then(($el) => $el.get(0))
		// .click();
		// cy.wait(2000);
		// cy.location("pathname", { timeout: 6000 }).should("include", "/app");
		// cy.focused().type("new task").wait(1000).type(`{enter}`);
	});
	it("get text with cy.conatins()", () => {
		cy.login(Cypress.env("auth_username"), Cypress.env("auth_password")).then(
			() => {
				cy.url().should("eq", "http://localhost:3000/");
			}
		);
		cy.visit("/app");

		cy.contains("new task");
	});
	it("new task has been added", () => {
		expect(screen.findByText("new task"));
		screen.findByTitle("ChevronsRight").then((element) => element.click());
		expect(waitFor(() => screen.getByTitle("ChevronsRight")));
	});
});
