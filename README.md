# cypress-guerrillamail

Add a random email generation using [guerrillamail.com](https://www.guerrillamail) and read the emails

## Installation

```bash
npm i -D cypress-guerrillamail
# or
yarn add -D cypress-guerrillamail
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
cy.getTemporaryEmail().as("@randomEmail");
```

Then you can read email using snippet below in your test script

```javascript
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
    // array of EmailData
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
