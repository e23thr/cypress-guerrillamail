/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

interface LinkData {
  text: string;
  href: string;
}

interface EmailData {
  subject: string;
  date: string;
  textContent: string;
  htmlContent: string;
  isRead: boolean;
  links: LinkData[];
}

interface GetEmailListParam {
  email: string;
  sender: string;
  deleteAfterRead: boolean;
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Get a temporary email address
     * @param
     * (no parameters)
     *
     * @returns
     * yield email address (string)
     *
     * @example
     * cy.getTemporaryEmail().then((emailAddress) => cy.log("Email address, emailAddress))
     */
    getTemporaryEmail(): Chainable<string>;

    /**
     * Get list of emails with links
     *
     * @param
     * param: GetEmailListParam
     *
     * @returns
     * Chainable<EmailData[]>
     *
     * @example
     * cy.getEmailList
     *
     */
    getEmailList(param: GetEmailListParam): Chainable<EmailData[]>;
  }
}
