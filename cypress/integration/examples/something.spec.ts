///<reference path="../../support/index.d.ts"/>

import "chai";

import { screen } from "@testing-library/dom";

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
});
