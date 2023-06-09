# cypress-guerrillamail

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/e23thr/cypress-guerrillamail/tree/release.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/e23thr/cypress-guerrillamail/tree/release)

## Introduction

A Cypress plugin to generate random email, using [guerrillamail.com](https://www.guerrillamail.com) and read its mail box that could be used for automated testing.

## Background / Context

Many testing scenarios such as user registration or forgot password, the target web app of the testing sends email for verification or multi factor authentication.
Such scenarios limits capability to automated testing as testers requires multiple email addresses and connect to those email inboxes via API or other methods to read its content.
To overcome this challenge, an random generated and disposable email address along with a capability to easily access its inbox would be preferrable.

In this plugin, we are using [guerrillamail.com](https://www.guerrillamail.com) to generate email addresses and read its inbox.
Please note that there are several disposable emails services available as the following:
- https://www.minuteinbox.com/
- https://temp-mail.org/
- https://tempmailo.com/
- https://tempail.com
- https://mail.tm
- https://temp-mail.io

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

## TODO

- [ ] Submit this as a plugin in Cypress [Link](https://github.com/cypress-io/cypress-documentation/blob/main/CONTRIBUTING.md#adding-plugins)
