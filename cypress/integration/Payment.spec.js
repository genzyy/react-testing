const { v4: uuidv4 } = require("uuid");

describe("payment", () => {
  it("user can make payments", () => {
    // login
    cy.visit("/");
    cy.findByRole("textbox", { name: /username/i }).type("johndoe");
    cy.findByLabelText(/password/i).type("s3cret");
    cy.findByRole("checkbox", {
      name: /remember me/i,
    }).check();
    cy.findByRole("button", {
      name: /sign in/i,
    }).click();
    // check account balance

    let oldBalance;
    cy.get("[data-test=sidenav-user-balance]").then(($balance) => (oldBalance = $balance.text()));

    // click on new button
    cy.findByRole("button", {
      name: /new/i,
    }).click();
    cy.findByRole("textbox").type("devon becker");
    cy.findByText(/devon becker/i).click();

    const paymentAmount = "5.00";

    cy.findByPlaceholderText(/amount/i).type(paymentAmount);
    const note = uuidv4();
    cy.findByPlaceholderText(/add a note/i).type(note);

    cy.findByRole("button", {
      name: /pay/i,
    }).click();

    cy.findByText(/return to transactions/i).click();

    cy.findByRole("tab", {
      name: /mine/i,
    }).click();

    cy.findByText(note).click({ force: true });

    cy.findByText(`-$${paymentAmount}`).should("be.visible");
    cy.findByText(note).should("be.visible");

    cy.get("[data-test=sidenav-user-balance]").then(($balance) => {
      const convertOldBalance = parseFloat(`${oldBalance}`.replace(/\$|,/g, ""));
      console.log($balance);
      const convertNewBalance = parseFloat($balance.text().replace(/\$|,/g, ""));
      console.log(convertOldBalance);
      console.log(convertNewBalance);
      expect(convertOldBalance - convertNewBalance).to.equal(parseFloat(paymentAmount));
    });

    // search for a user
    // add amount and note and click pay
    // return to transactions
    // go to personal payments
    // click on payment
    // verify if payment was made
    // verify if payment was deducted
  });
});
