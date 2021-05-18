describe("Login sample", function() {
  it("Successfully logged in", () => {
    cy.visit("localhost:3000");
    cy.get("#username").type("bdd-test-create");
    cy.get("#password")
      .click()
      .type("JiAX90*pK7L&5r2GbE@m");
    cy.get("#kc-form-login").submit();
    cy.url().should("eq", "http://localhost:3000/home/");
  });
});
