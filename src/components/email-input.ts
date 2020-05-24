import { Tag, TagEvent } from "./tag";
import EmailValidator from "../utils/email-validator";
import { EventEmitter } from "events";

/**
 * @ignore
 */
enum EmailInputEvent {
  FOCUS_OUT = "focusout",
  ON_CHANGE = "keyup",
  KEY_PRESSED = "keypress",
}

/**
 * @ignore
 */
enum KEY_CODE {
  ENTER = 13,
}

export enum EmailEvent {
  SUBSCRIBE = "subscribe",
}

export interface EmailInputOtions {
  placeholder: string;
  id?: string;
  name?: string;
  className?: string;
}

/**
 * EmailInput class extends EventEmitter. Constructor will expect parametes the first parameter is mandatory
 * which is the parent host where this component lives.
 * The second parameter is optional
 */
export class EmailInput extends EventEmitter {
  private _containerNode: HTMLDivElement;
  private _emails: Tag[] = [];
  private _input: HTMLInputElement;
  private _tagHolder: HTMLDivElement;
  constructor(containerNode: HTMLDivElement, options?: EmailInputOtions) {
    super();

    this._containerNode = containerNode;
    this._containerNode.classList.add("container-node");

    this._input = document.createElement("input");
    this._input.type = "email";
    this._input.id = options?.id || "emailReference";
    this._input.placeholder = options?.placeholder || "";
    this._input.name = options?.name || "email-input-field";
    if (options && options.className) {
      this._input.classList.add(options.className);
    } else {
      this._input.classList.add("input-holder__input");
    }

    const inputHolder: HTMLDivElement = document.createElement("div");
    inputHolder.classList.add("input-holder");
    inputHolder.appendChild(this._input);
    this._containerNode.appendChild(inputHolder);

    this._tagHolder = document.createElement("div");
    this._tagHolder.classList.add("tag-holder");

    this._onListeners();
  }

  /**
   * This method returns total number of valid emails exist in the emails list.
   */
  public getVaildEmailCount = (): number => {
    return this._emails.filter((tag: Tag): boolean =>
      EmailValidator.vaildate(tag.getText())
    ).length;
  };

  /**
   * This method allows to add email to the existing emails list.
   */
  public addEmail = (email: string): void => {
    if (email.length === 0) return;
    this._input.value = email;
    this._addEmailsToTheList();
    this._addTags();
  };

  /**
   * This method returns list of emails.
   */
  public getAllEmails = (): string[] => {
    return this._emails.map((tag: Tag): string => tag.getText());
  };

  /**
   * This method is to replace all the existing emails in the emails list by passing an email.
   */
  public replaceAll = (email: string): void => {
    const size = this._emails.length;
    this._clearAll()
      .then(() => {
        for (let i = 0; i < size; i++) {
          this._input.value = email;
          this._addEmailsToTheList();
        }
        this._addTags();
      })
      .catch((e: Error) => {
        // we can handle error here..
      });
  };

  private _onListeners = (): void => {
    this._input.addEventListener(
      EmailInputEvent.FOCUS_OUT,
      this._onFocusEventHandler
    );

    this._input.addEventListener(
      EmailInputEvent.KEY_PRESSED,
      this._onKeyPressedEventHandler
    );
    this._input.addEventListener(
      EmailInputEvent.ON_CHANGE,
      this._onChangeHandler
    );

    const self = this;
    this._emails.push = function onPush(...args: Tag[]) {
      const prevValues = self._emails.map((tag: Tag) => tag.getText());
      const result = Array.prototype.push.apply(this, args);
      const newValues = args.map((tag: Tag) => tag.getText());
      self._emit(prevValues, newValues);
      return result;
    };

    this._emails.splice = function onSplice(startIdx: number, endIdx: number) {
      const prevValues = self._emails.map((tag: Tag) => tag.getText());
      const result = Array.prototype.splice.apply(this, [startIdx, endIdx]);
      const newValues = self._emails.map((tag: Tag) => tag.getText());
      self._emit(prevValues, newValues);
      return result;
    };
  };

  private _emit = (previousArray: string[], newArray: string[]): void => {
    this.emit(EmailEvent.SUBSCRIBE, {
      oldValue: previousArray,
      newValue: newArray,
    });
  };

  private _onFocusEventHandler = (e: FocusEvent): void => {
    this._addEmailsToTheList();
    this._addTags();
  };

  private _onKeyPressedEventHandler = (e: KeyboardEvent): void => {
    if (e.keyCode === KEY_CODE.ENTER && this._input.value) {
      this._addEmailsToTheList();
      this._input.blur();
    }
  };

  private _onChangeHandler = (e: KeyboardEvent): void => {
    const commaRegx: RegExp = /,/g;
    if (commaRegx.test(this._input.value) === true) {
      const value = this._input.value.replace(commaRegx, " ");
      this._input.value = "";
      const values: string[] = value.split(" ");

      if (values.length > 0) {
        for (let value of values) {
          if (value) {
            this._input.value = value.replace(/[“”]+/g, "");
            this._addEmailsToTheList();
          }
        }
        this._input.blur();
      }
    }
  };

  private _addEmailsToTheList = (): void => {
    const value: string = this._input.value;
    if (value.length === 0) return;
    if (EmailValidator.vaildate(value) === true) {
      this._emails.push(new Tag(value));
    } else {
      this._emails.push(new Tag(value, true));
    }
    this._input.value = "";
  };

  private _addTags = (): void => {
    if (this._emails.length > 0) {
      for (let email of this._emails) {
        const tag = email.get() as HTMLSpanElement;
        this._tagHolder.appendChild(tag);
        email.addListener(TagEvent.REMOVE_TAG, this._onRemoveTagEvent);
      }
      if (!this._tagHolder.parentNode) {
        this._containerNode.insertBefore(
          this._tagHolder,
          this._containerNode.childNodes[0]
        );
      }
      this._containerNode.scrollIntoView(false);
    }
  };

  private _onRemoveTagEvent = (args: any): void => {
    const {
      detail: { id },
    } = args;

    for (let email of this._emails) {
      const tag = email.get() as HTMLSpanElement;
      if (id === tag.id) {
        this._emails.splice(this._emails.indexOf(email), 1);
        if (tag.parentNode) {
          tag.parentNode.removeChild(tag);
          if (
            this._tagHolder.children.length === 0 &&
            this._tagHolder.parentNode
          ) {
            this._tagHolder.parentNode.removeChild(this._tagHolder);
          }
          email.removeListener(TagEvent.REMOVE_TAG, this._onRemoveTagEvent);
          break;
        }
      }
    }
  };

  private _clearAll = (): Promise<boolean | Error> => {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        while (this._tagHolder.firstChild) {
          this._tagHolder.removeChild(this._tagHolder.firstChild);
        }
        for (let email of this._emails) {
          email.removeListener(TagEvent.REMOVE_TAG, this._onRemoveTagEvent);
        }
        this._emails = [];
        if (this._tagHolder.parentNode)
          this._tagHolder.parentNode.removeChild(this._tagHolder);

        resolve(true);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };
}
