describe("Storefront navigation", () => {
  it("opens the storefront and navigates to the shop", () => {
    cy.visit("/");
    cy.get("main").should("be.visible");
    cy.contains("a", "Shop the collection").click();
    cy.location("pathname").should("eq", "/shop");
    cy.get("main").should("be.visible");
  });
});
