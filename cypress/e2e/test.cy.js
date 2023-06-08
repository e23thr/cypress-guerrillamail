/// <reference types="cypress" />

/// <reference types="../support" />

const dummyEmailAddress = "e23thr-dummy@guerrillamail.org";

describe("Get a temporary email address", function () {
  it("should visit https://www.guerrillamail.com", function () {
    cy.visit("/", { log: false });
    cy.url().should("match", /^https?:\/\/(www.?)?guerrillamail.com/);
  });

  it("should visit inbox page", function () {
    cy._visitInbox();
    cy.url().should("contain", "/inbox");
  });

  it("should get an email address", function () {
    cy._visitInbox();
    cy.getTemporaryEmail().should((email) => {
      expect(email).match(
        /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/,
        "Email address compliant with RFC2822"
      );
    });
  });

  it("should have email from no-reply@guerrillamail.com", function () {
    cy._getAllEmailFrom("no-reply@guerrillamail.com").as("emails");
    cy.get("@emails").should("be.instanceOf", Array);
    cy.get("@emails").should("have.a.property", "length");
    cy.get("@emails").should("have.length.at.least", 1);
  });

  it(`should change email to ${dummyEmailAddress}`, function () {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    cy._changeEmailAddress(dummyEmailAddress);
    cy.getTemporaryEmail().should("eq", dummyEmailAddress);
  });
});
