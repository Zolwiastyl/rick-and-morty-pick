///<reference path="../../support/index.d.ts"/>

import { screen, waitFor } from "@testing-library/react";

export const x = 0;

describe("basic user flow works", () => {
	it("asserts work on basics", () => {
		expect(true).to.equal(true);
	});
	it("it gets token and logs in", () => {
		return cy
			.visit("/")
			.login(Cypress.env("auth_username"), Cypress.env("auth_password"))
			.then(() => {
				cy.url().should("eq", "http://localhost:3000/").visit("/app");
			});
	});
	it("get text with cy.conatins()", () => {
		cy.visit("/app");
		// cy.get("add-task-field").click();
		cy.contains("todo");

		// cy.type("new task");
		// cy.type("{ enter }"
	});
	it("get text with findBy", () => {
		expect(screen.findByRole("button"));
		expect(screen.findByText("todo"));
		expect(screen.findByTitle("ChevronsRight").then((el) => el.click()));
		cy.get("button")
			.then(($el) => $el.get(0))
			.click();
		cy.focused().type("new task").type(`{enter}`);

		screen.findByTitle("ChevronsRight").then((element) => element.click());
		waitFor(() => screen.getByTitle("ChevronsRight").click());
	});
});
