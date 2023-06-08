const guerrillamail_url = "https://www.guerrillamail.com/";

Cypress.Commands.add(
  "_waitForElement",
  (
    selector,
    option = {
      log: false,
      check: true,
      timeout: undefined,
      interval: undefined,
      tries: undefined,
    }
  ) => {
    const _option = {
      log: typeof option.log !== "undefined" ? option.log : false,
      check: typeof option.check !== "undefined" ? option.check : true,
      timeout: option.timeout,
      interval: option.interval,
      tries: option.tries,
    };
    if (_option.log) {
      cy.log(`_waitForElement ${selector}`);
    }
    cy.waitUntil(
      () => {
        if (typeof _option.check === "function") {
          const result = _option.check(Cypress.$(selector));
          return result;
        }
        if (typeof _option.check === "boolean") {
          const elements = Cypress.$(selector).get() || null;
          const elementsFound = Array.isArray(elements)
            ? Boolean(elements.length)
            : Boolean(elements);
          if (_option.check) {
            return elementsFound;
          }
          return !elementsFound;
        }
      },
      {
        log: false,
        timeout: _option.timeout,
        interval: _option.interval,
        tries: _option.tries,
      }
    );
  }
);

Cypress.Commands.add("_waitForStatusAlertDisappear", () => {
  cy._waitForElement(".status_alert", {
    timeout: 60000, // 60_000,
    interval: 500,
    customMessage: "Wait for status alert to disappeared",
    log: false,
    check: (elements) => {
      return elements.length === 0;
    },
  });
});

Cypress.Commands.add("_waitForInboxPageReady", (options = { log: false }) => {
  cy._waitForElement("#inbox-id", { log: options.log, check: true });
  cy._waitForElement("#gm-host-select", { log: options.log, check: true });
});

Cypress.Commands.add("_visitInbox", () => {
  cy.url({ log: false }).then((url) => {
    if (!url.endsWith("/inbox")) {
      cy.visit("/inbox");
      cy._waitForInboxPageReady();
      cy._waitForStatusAlertDisappear();
    }
  });
});

Cypress.Commands.add("_changeEmailAddress", (emailAddress) => {
  const [userId, domain] = emailAddress.split("@");
  cy._visitInbox();
  // userId
  cy._waitForStatusAlertDisappear();
  cy._waitForElement("#inbox-id", { log: false });
  cy.get("#inbox-id", { log: false }).click({ log: false });
  cy._waitForElement("#inbox-id > input[type=text]");
  cy.get("#inbox-id > input[type=text]", { log: false }).type(
    `${userId}{enter}`
  );

  // domain
  cy._waitForStatusAlertDisappear();
  cy._waitForElement("#gm-host-select");
  cy._waitForStatusAlertDisappear();
  cy.get("#gm-host-select", { log: false }).select(domain);

  // cy._waitForStatusAlertDisappear();
  cy.get("#gm-host-select", { log: false }).should("have.value", domain);
  cy.get("#inbox-id", { log: false }).should("contain", userId);
});

Cypress.Commands.add("_readEmailById", (id, deleteAfterRead = false) => {
  cy.get(`#${id}`, { log: false })
    .click({ log: false })
    .get(".email_subject", { log: false })
    .then((e) => {
      const s = e.text();
      cy.wrap(s).as("emailSubject");
    })
    .get(".email_date", { log: false })
    .then((e) => {
      const s = e.text();
      cy.wrap(s).as("emailDate");
    })
    .get(".email_body", { log: false })
    .then((e) => {
      const bodyText = e.text();
      const bodyHtml = e.html();
      cy.wrap(bodyText).as("emailBodyText");
      cy.wrap(bodyHtml).as("emailBodyHtml");
    })
    .get(".email_body a", { log: false })
    .then((links) => {
      const _links = [];
      links.each((idx, element) => {
        _links.push({
          text: element.innerText,
          href: element.getAttribute("href"),
        });
      });
      cy.wrap(_links, { log: false }).as("emailLinks");
    })
    .then(() => {
      let subject = "";
      let date = "";
      let emailText = "";
      let emailHtml = "";
      let links = [];
      cy.get("@emailSubject", { log: false })
        .then((emailSubject) => {
          subject = emailSubject;
        })
        .get("@emailDate", { log: false })
        .then((emailDate) => {
          date = emailDate;
        })
        .get("@emailBodyText", { log: false })
        .then((emailBodyText) => {
          emailText = emailBodyText;
        })
        .get("@emailBodyHtml", { log: false })
        .then((emailBodyHtml) => {
          emailHtml = emailBodyHtml;
        })
        .get("@emailLinks", { log: false })
        .then((emailLinks) => {
          links = emailLinks;
        })
        .then(() => {
          const data = {
            subject,
            date,
            emailText,
            emailHtml,
            links,
          };
          cy.wrap(data, { log: false });
        });
    })
    .then((data) => {
      cy.get("#back_to_inbox_link", { log: false }).click({ log: false });
      cy.wrap(data, { log: false });
    })
    .then((data) => {
      if (deleteAfterRead) {
        cy.get(`#${id}.mail_row > .td1 > input[type=checkbox]`, {
          log: false,
        })
          .click({ log: false })
          .get("#del_button", { log: false })
          .click({ log: false });
      }
      cy.wrap(data, { log: false });
    });
});

Cypress.Commands.add("_getAllEmailFrom", (sender) => {
  const unreadSelector = "email_unread"; //  '.email_unread';
  const rowSelector = `#email_list > tr.mail_row`;

  cy._visitInbox();

  cy.get(rowSelector, { log: false }).then((elements) => {
    const htmlElements = [];
    elements.each(function (idx) {
      htmlElements.push(elements[idx]);
    });
    const emailList = [];
    htmlElements.forEach((el) => {
      const td3 = el.querySelector(".td3");
      const elId = el.getAttribute("id");
      const email = el.querySelector(".td2").innerText.trim().toLowerCase();
      const subject = td3.childNodes.length
        ? td3.childNodes[0].textContent
        : td3.innerText;
      const isRead = !el.className.includes(unreadSelector);
      if (email === sender) {
        emailList.push({
          from: email,
          subject: subject,
          id: elId,
          isRead: isRead,
        });
      }
    });

    cy.wrap(emailList, { log: false });
  });
});

Cypress.Commands.add("getTemporaryEmail", function () {
  const validateEmail = (email) => {
    const re = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
    return re.test(email);
  };

  cy._visitInbox();

  cy.get("#inbox-id", { log: false })
    .then((el) => {
      cy.wrap(el.text(), { log: false });
    })
    .then((id) => {
      cy.get("#gm-host-select", { log: false })
        .then((el) => {
          cy.wrap(el.val(), { log: false });
        })
        .then((domainName) => {
          const emailAddress = `${id}@${domainName}`;
          expect(validateEmail(emailAddress), `${emailAddress} is valid`).to.be
            .true;
          cy.wrap(emailAddress, { log: false });
        });
    });
});

Cypress.Commands.add("getEmailList", (param) => {
  const sender = param.sender;
  const email = param.email;
  const deleteAfterRead = param.deleteAfterRead;
  cy._visitInbox();
  cy.wrap([], { log: false }).as("emailList");

  // change email according to args
  cy._waitForStatusAlertDisappear();
  cy._changeEmailAddress(email);

  // wait for status_alert about new email
  cy._waitForElement(".status_alert", {
    tries: 120000, // 120_000,
    interval: 1000, // 1_000,
    check: (element) => {
      let hasNewMail = false;
      element.each((idx) => {
        const _text = element[idx].innerText.toLowerCase();
        if (_text.includes("got new mail")) {
          hasNewMail = true;
        }
      });
      return hasNewMail;
    },
  });

  cy._getAllEmailFrom(sender).then((emailList) => {
    //
    const idList = emailList.map(({ id }) => id);
    const results = [];
    cy.wrap(idList, { log: false })
      .each((id) => {
        cy._readEmailById(id, deleteAfterRead).then((data) => {
          results.push(data);
        });
      })
      .then(() => {
        expect(results).instanceOf(Array).to.have.length.gt(0);
        cy.wrap(results, { log: false });
      });
  });
});
