import { directive, AttributePart } from "../web_modules/lit-html.js";

export const bind = directive(refObject => part => {
  console.log(part instanceof AttributePart);
  console.log(part.committer.name);
  if (part instanceof AttributePart && part.committer.name === "ref") {
    console.log("Binding ref object");
    console.dir(part.committer.element);
    refObject.current = part.committer.element;
  }
});

export const createRef = () => ({
  current: null
});
