## Description

- Input field with emails (let’s call it emails-input) should be implemented as a separate js script/component, so it can be used in any other form independently.
- Two blue buttons of this form should be implemented outside emails-input and interact with it via its public API and it's documentation is available here [API documentation](https://sajanv88.github.io/email-input-app/docs/classes/emailinput.html)

## Getting started

### Prerequisite

- install nodejs [download here](https://nodejs.org/en/download/)
- `npm install -g yarn`
- git clone [emailinput](https://github.com/sajanv88/email-input-app.git)

### Development mode

- first install all the dependencies
  _`yarn install`
  _`yarn start:dev` to start the local development server which is running on port 9000
- click `open` to see it in the browser [open](http://localhost:9000)

### Production build

- you should run this command. `yarn build` this will generate a dist folder in the root directory.

### Generating Docs

- everytime when `yarn build` command excutes the documentation will be created automatically inside the `dist` folder.

* document will be generated only for the `email-input.ts` component file. This is intentionally set this way for this demo purpose.

### Deployment

- running `yarn deploy` command will deploy the application

### Demo

- Here is the [Demo](https://sajanv88.github.io/email-input-app/index.html) version of the app hosted in gh-pages

## Example usage

- Know more about EmailInput component api please read the the [API documentation](https://sajanv88.github.io/email-input-app/docs/classes/emailinput.html)

Html code:

```
<html>
  <head>
    <meta charset="utf-8" />
    <title>Email input app</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300&display=swap"
      rel="stylesheet"
    />
    <script src="email-input.js" defer></script>
  </head>
  <body>
    <form class="container">
      <div class="form-container">
        <div class="input-container">
          <h1 class="heading">Share <span>Board name</span> with others</h1>

          <div id="emails-input"></div>
        </div>
        <div class="action-container">
          <button class="btn" id="addEmail">Add email</button>
          <button class="btn" id="emailCount">Get emails count</button>
        </div>
      </div>
    </form>
  </body>
</html>
```

ts code:

```
import {
  EmailInput,
  EmailInputOtions,
  EmailEvent,
} from "./components/email-input";

const inputContainerNode: HTMLDivElement = document.getElementById(
  "emails-input"
) as HTMLDivElement;

const options: EmailInputOtions = {
  placeholder: "add more people...",
};

const emailInput = new EmailInput(inputContainerNode, options);

// this will invoke whenever email get added or removed in the emails list.

emailInput.addListener(EmailEvent.SUBSCRIBE, (args) => {
  const { oldValue, newValue } = args;
  console.log(`Old value: ${oldValue}`)
  console.log(`New value: ${newValue}`)
});

// Get emails count button reference
const emailCountBtnRef = document.getElementById("emailCount");

// Get Add email button reference
const addEmailBtnRef = document.getElementById("addEmail");


if (emailCountBtnRef !== null && addEmailBtnRef !== null) {
  // fetch valid email count
  emailCountBtnRef.addEventListener("click", function onClick(e): void {
    window.alert(
      `Total valid email count is ${emailInput.getVaildEmailCount()}`
    );
  });

// adding an email to the list
  addEmailBtnRef.addEventListener("click", function onClick(e): void {
    const email: string = `random${Math.floor(Math.random() * 100)}@miro.com`;
    emailInput.addEmail(email);
  });
}

// other public methods are available in emailinput instance such as:

emailInput.getAllEmails() // returns all the emails as a list

emailInput.replaceAll(email); // will replace all the exsiting emails in the list

```

## Author

- Sajankumar Vijayan [website](https://www.sajankumarv.com)
