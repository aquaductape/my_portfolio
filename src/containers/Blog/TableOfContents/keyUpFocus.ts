import style from "./TableOfContents.module.scss";

let documentListenerAdded = false;
let asideEl!: HTMLElement;

const documentKeyUp = (e: KeyboardEvent) => {
  if (![" ", "Enter", "Tab"].includes(e.key)) return;
  const target = e.target as HTMLElement;
  if (asideEl.contains(target)) return;

  documentListenerAdded = false;
  document.removeEventListener("keyup", documentKeyUp);
  document.removeEventListener("click", documentClick);
  asideEl.classList.remove(style["active"]);
};

const documentClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (asideEl.contains(target)) return;

  documentListenerAdded = false;
  document.removeEventListener("keyup", documentKeyUp);
  document.removeEventListener("click", documentClick);
  asideEl.classList.remove(style["active"]);
};

const onKeyUpFocus = (e: KeyboardEvent) => {
  if (![" ", "Enter", "Tab"].includes(e.key)) return;

  asideEl = document.querySelector("." + style["aside"]) as HTMLElement;
  if (!documentListenerAdded) {
    document.addEventListener("keyup", documentKeyUp);
    document.addEventListener("click", documentClick);
  }
  asideEl.classList.add(style["active"]);
};

export default onKeyUpFocus;
