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

			.visit("/app");
		cy.wait(2000);
		cy.get("button");
		expect(screen.getByTitle("LogOut"));
		// cy.get("button")
		// .then(($el) => $el.get(0))
		// .click();
		// cy.wait(2000);
		// cy.location("pathname", { timeout: 6000 }).should("include", "/app");
		// cy.focused().type("new task").wait(1000).type(`{enter}`);
	});
	it("get text with cy.conatins()", () => {
		cy.login(Cypress.env("auth_username"), Cypress.env("auth_password")).wait(
			2000
		);
		cy.visit("/app");

		cy.contains("new task");
	});
	it("get text with findBy", () => {
		expect(screen.findByRole("button"));
		expect(screen.findByText("todo"));
		expect(screen.findByTitle("ChevronsRight").then((el) => el.click()));
		cy.get("button")
			.then(($el) => $el.get(0))
			.click();
		cy.focused().type("new task").type(`{enter}`);
		expect(screen.findByText("new task"));
		screen.findByTitle("ChevronsRight").then((element) => element.click());
		waitFor(() => screen.getByTitle("ChevronsRight").click());
	});
});
