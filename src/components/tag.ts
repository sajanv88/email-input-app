import { EventEmitter } from "events";

export enum TagEvent {
  CLICK = "click",
  REMOVE_TAG = "remove_tag",
}

export class Tag extends EventEmitter {
  private _span: HTMLSpanElement;
  constructor(text: string, showErrorState: boolean = false) {
    super();
    this._span = document.createElement("span");
    this._span.classList.add("tag");

    if (showErrorState === true) {
      this._span.classList.add("tag--error");
    } else {
      this._span.classList.add("tag--success");
    }
    this._span.textContent = text;
    this._span.id = String(new Date().getTime() * Math.random()); // just a simple random unique id

    const icon = document.createElement("i");
    icon.classList.add("tag__icon");
    icon.innerHTML = this._removeIcon();
    icon.addEventListener(TagEvent.CLICK, this._onClickEventHandler);

    this._span.appendChild(icon);
  }

  public get = (): HTMLSpanElement => {
    return this._span;
  };

  public getText = (): string => {
    return this._span.textContent?.trim() || "";
  };

  private _removeIcon = (): string => {
    return `
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z" fill="#050038"/>
    </svg>
    `;
  };
  private _onClickEventHandler = (e: MouseEvent): void => {
    e.stopImmediatePropagation();
    this.emit(TagEvent.REMOVE_TAG, { detail: { id: this._span.id } });
  };
}
