/// <reference types="cypress" />

describe("Todo App", () => {
  it("should have input field", () => {
    cy.visit("http://localhost:3000");
    cy.get("#new-todo").should("exist");
  });

  it("should add new elements", () => {
    cy.visit("http://localhost:3000");
    cy.get("#new-todo").type("learn cypress");
    cy.get("#add-todo").click();
    cy.get("#todo-list").get("li").should("have.length", 1);
  });
});
