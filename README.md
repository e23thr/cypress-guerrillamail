# cypress-guerrillamail

Add a random email generation using [guerrillamail.com](https://www.guerrillamail.com) and read the emails

## Installation

```bash
npm i -D cypress-guerrillamail
# or
yarn add -D cypress-guerrillamail
```

## Dependency installation

cypress-guerrillamail requires [cypress-wait-until](https://www.npmjs.com/package/cypress-wait-until) as peer dependencies.

```bash
npm i -D cypress-wait-until
# or
yarn add -D cypress-wait-until
```

## Usage

`cypress-guerrillamail` extends Cypress `cy` command.

import this module in `cypress/support/e2e.js`

```javascript
// file: cypress/support/e2e.js
import "cypress-guerrillamail";
```

To get a random email address in your test script

```javascript
cy.origin("https://www.guerrillamail.com", function () {
  cy.getTemporaryEmail().as("@randomEmail");
});
```

Then you can read email using snippet below in your test script after your site send the email to `@randomEmail`

```javascript
cy.origin("https://www.guerrillamail.com", function () {
  cy.get("@randomEmail")
    .then((randomEmail) => {
      cy.getEmailList(
        {
          email: randomEmail,
          sender: "<Your test site email sender>",
          deleteAfterRead: true,
        } /* :GetEmailListParam */
      );
    })
    .then((emails /* :EmailData[] */) => {
      // process emails here
    });
});
```

## Types

```typescript
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
```

## Note

To make this module work, add experiment option `experimentalOriginDependencies` to `e2e` section in your `cypress.config.js` to get rid of origin error. (see [document](https://docs.cypress.io/guides/references/experiments))

```javascript
/// file: cypress.config.js
module.exports = defineConfig({
  e2e: {
    experimentalOriginDependencies: true,
  },
});
```
