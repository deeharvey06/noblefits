describe("Storefront browser journeys", () => {
  beforeEach(() => {
    cy.viewport(1200, 800);
  });

  it("opens the home page and renders the complete catalog", () => {
    cy.visit("/");
    cy.contains("h1", "Build your everyday rotation.").should("be.visible");
    cy.get(".home-hero img").should(($images) => {
      expect($images.toArray().every((image) => image.complete)).to.eq(true);
    });
    cy.screenshot("portfolio-home", { capture: "viewport", scale: true });
    cy.contains("a", "Shop the collection").click();
    cy.location("pathname").should("eq", "/shop");
    cy.contains("h1", "Shop all Noble Fits.").should("be.visible");
    cy.get("main article").should("have.length", 35);
  });

  it("filters and sorts the catalog and resets filters", () => {
    cy.visit("/shop");
    cy.get('[aria-label="Product filters"]').within(() => {
      cy.contains("label", "Hats").click();
      cy.contains("label", "Under $50").click();
    });
    cy.get('select[name="catalog-sort"]').select("price-asc");
    cy.get("main article").should("have.length", 9);
    cy.get("main article").first().should("contain.text", "Palm Tree Cap");
    cy.get('[aria-label="Product filters"]')
      .contains("button", "Clear all")
      .click();
    cy.get("main article").should("have.length", 35);
  });

  it("persists a bag across reloads, changes quantity, and removes the item", () => {
    cy.visit("/shop/jackets/18");
    cy.contains("h1", "Black Jean Shearling").should("be.visible");
    cy.get('button[aria-label^="Increase quantity for"]').click();
    cy.contains("button", /^Add to bag$/).click();
    cy.contains("2 items added to your bag.").should("be.visible");
    cy.contains("a", "View bag").click();
    cy.contains("h1", "Complete your purchase.").should("be.visible");
    cy.get('article[aria-label="Black Jean Shearling, quantity 2"]').should(
      "exist",
    );
    cy.reload();
    cy.get('article[aria-label="Black Jean Shearling, quantity 2"]').should(
      "exist",
    );
    cy.get(
      'button[aria-label="Decrease black jean shearling quantity"]',
    ).click();
    cy.get('article[aria-label="Black Jean Shearling, quantity 1"]').should(
      "exist",
    );
    cy.get('button[aria-label="Remove Black Jean Shearling from bag"]').click();
    cy.contains("h2", "Your bag is empty").should("be.visible");
  });

  it("searches, retains recent searches, and handles no results", () => {
    cy.visit("/search");
    cy.get('input[type="search"]').type("Nike{enter}");
    cy.location("search").should("include", "q=Nike");
    cy.contains("h2", "Catalog matches").should("be.visible");
    cy.get('input[type="search"]').clear().type("zzzznomatch{enter}");
    cy.contains("h2", "Nothing matched").should("be.visible");
    cy.visit("/search");
    cy.contains("button", "Nike").click();
    cy.contains("h2", "Catalog matches").should("be.visible");
  });

  it("provides a recoverable 404 and anonymous account access", () => {
    cy.visit("/not-a-real-page");
    cy.contains("h1", "We couldn’t find that page.").should("be.visible");
    cy.contains("a", "Browse the shop").click();
    cy.contains("h1", "Shop all Noble Fits.").should("be.visible");
    cy.visit("/account");
    cy.location("pathname").should("eq", "/signin");
    cy.contains("h2", "Sign in to Noble Fits").should("be.visible");
    cy.contains("a", "Forgot password?").click();
    cy.contains("h1", "Reset your password.").should("be.visible");
  });

  it("opens and dismisses the mobile menu with keyboard focus restored", () => {
    cy.viewport(390, 844);
    cy.visit("/");
    cy.get('button[aria-label="Open navigation menu"]').click();
    cy.get('[role="dialog"]').should("be.visible");
    cy.get("#root").should("have.attr", "inert");
    cy.get('[role="dialog"]').trigger("keydown", { key: "Escape" });
    cy.get('[role="dialog"]').should("not.exist");
    cy.get('button[aria-label="Open navigation menu"]').should("have.focus");
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
    cy.screenshot("portfolio-mobile", { capture: "viewport" });
  });

  it("applies product filters in the mobile drawer", () => {
    cy.viewport(390, 844);
    cy.visit("/shop");
    cy.contains("button", /^Filters/).click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("label", "Hats").click();
      cy.contains("button", "View 9 products").click();
    });
    cy.get('[role="dialog"]').should("not.exist");
    cy.get("main article").should("have.length", 9);
    cy.document().then((doc) =>
      expect(doc.documentElement.scrollWidth).to.be.at.most(390),
    );
  });

  it("keeps catalog navigation usable when product images fail", () => {
    cy.then(() =>
      Cypress.automation("remote:debugger:protocol", {
        command: "Network.clearBrowserCache",
      }),
    );
    cy.intercept("https://i.ibb.co/**", { statusCode: 404, body: "" });
    cy.visit("/shop/jackets/18");
    cy.contains("h1", "Black Jean Shearling").should("be.visible");
    cy.contains("Image unavailable").should("be.visible");
    cy.contains("button", /^Add to bag$/).click();
    cy.contains("1 item added to your bag.").should("be.visible");
  });
});
