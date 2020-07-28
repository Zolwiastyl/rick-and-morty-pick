///<reference path="../../support/index.d.ts"/>

import "@testing-library/cypress/add-commands";

export const x = 0;

const firstColumnOfTasksId = ".space-x-2 > :nth-child(1) > .w-full";
const secondColumnOfTasksIdBeforeDrag =
	".overflow-hidden > .space-x-2 > :nth-child(2)";
const secondColumnOfTasksIdAfterDrag = ".space-x-2 > :nth-child(2) > .w-full";

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
		cy.get(".space-x-2 > :nth-child(1) > .w-full")
			.children()
			.should("have.length", 3)
			.wait(5000);
		cy.get('[data-testid="task to move"]').drag(
			secondColumnOfTasksIdBeforeDrag
		);

		cy.get(secondColumnOfTasksIdAfterDrag)
			.children()
			.should("have.length", 1);

		cy.get(firstColumnOfTasksId).children().should("have.length", 2);

		cy.get('[data-testid="task to move"]').drag(firstColumnOfTasksId);
		cy.get("[data-testid=RefreshCcw] > .h-12").click().wait(4000);
		cy.get(firstColumnOfTasksId).children().should("have.length", 3);
		cy.get(secondColumnOfTasksIdAfterDrag).children().should("not.exist");
	});
});
