import "./styles/main.less";

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

emailInput.addListener(EmailEvent.SUBSCRIBE, (args) => {
  console.log(args, "args");
});

const emailCountBtnRef = document.getElementById("emailCount");
const addEmailBtnRef = document.getElementById("addEmail");

if (emailCountBtnRef !== null && addEmailBtnRef !== null) {
  emailCountBtnRef.addEventListener("click", function onClick(e): void {
    window.alert(
      `Total valid email count is ${emailInput.getVaildEmailCount()}`
    );
  });
  addEmailBtnRef.addEventListener("click", function onClick(e): void {
    const email: string = `random${Math.floor(Math.random() * 100)}@miro.com`;
    emailInput.addEmail(email);
  });
}
