import { html } from "/web_modules/lit-html.js";
import { render } from "../web_modules/lit-html.js";
import "./basic/some-element.js";
import "./basic/some-sink.js";
import "./todo/app.js";
import "./kanban/app.js";
import {
  TODO_COMPLETED,
  TODO_SELECTED,
  TODO_UNSELECTED,
  TODO_DELETED,
  TODO_LIST_ADDED_TODO
} from "./todo/constants.js";
import {
  COLUMN_CARD_ADDED,
  COLUMN_CARD_DROPPED,
  CARD_DRAG_STARTED,
  CARD_DRAGGED_OVER,
  CARD_DRAG_ENDED,
  CARD_EDIT_TRIGGERED
} from "./kanban/constants.js";

// const basicTemplate = html`
//   <some-sink initial-value="3" name="a">
//     <some-element count-exclamations="@a/value" ref="@a/ref"></some-element>
//   </some-sink>
//   <some-sink .initialValue=${2} name="b">
//     <some-element count-exclamations="@b/value">Tony</some-element>
//   </some-sink>
//   <some-sink initial-value="3" name="c">
//     <some-element count-exclamations="@c/value">Someone</some-element>
//   </some-sink>

//   Click any of the above to increase the exclamation points.
// `;

// const otherTemplate = html`
//   <todo-app></todo-app>
// `;

// function addExampleMountPoint(id, title, actionsToWatch = []) {
//   const div = document.createElement("div");
//   div.id = id;
//   const header = document.createElement("h1");
//   header.innerText = title;
//   const mount = document.createElement("div");
//   div.appendChild(header);
//   div.appendChild(mount);
//   document.body.appendChild(div);
//   actionsToWatch.forEach(action => {
//     div.addEventListener(action, e => console.log(action, e.detail));
//   });
//   div.style = "position: relative";
//   return mount;
// }

const kanbanTemplate = html`
  <kanban-example></kanban-example>
`;

// render(basicTemplate, addExampleMountPoint("basic", "Basic Example"));
// render(
//   otherTemplate,
//   addExampleMountPoint("todo", "TODO Application", [
//     TODO_COMPLETED,
//     TODO_SELECTED,
//     TODO_UNSELECTED,
//     TODO_DELETED,
//     TODO_LIST_ADDED_TODO
//   ])
// );
// render(
//   kanbanTemplate,
//   addExampleMountPoint("kanban", "Kanban Example", [
//     COLUMN_CARD_ADDED,
//     COLUMN_CARD_DROPPED,
//     CARD_DRAG_STARTED,
//     CARD_DRAGGED_OVER,
//     CARD_DRAG_ENDED,
//     CARD_EDIT_TRIGGERED
//   ])
// );

render(kanbanTemplate, document.body);
document.body.style = "margin: 0; padding: 0;";
