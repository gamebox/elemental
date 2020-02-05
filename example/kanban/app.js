import { element } from "../../src/element.js";
import { html } from "../../web_modules/lit-html.js";
import "./store.js";
import "./board.js";
import "./modal.js";

const view = ({ initialState }) => html`
  <kanban-store name="store" .columns=${initialState}>
    <kanban-board
      columns="@store/columns"
      dragState="@store/dragState"
    ></kanban-board>
    <kanban-card-modal card="@store/selectedCard"></kanban-card-modal>
  </kanban-store>
`;

const TODO = "Todo";
const IN_PROGRESS = "In Progress";
const DONE = "Done";

const DEFAULT_STATE = {
  [TODO]: [],
  [IN_PROGRESS]: [],
  [DONE]: [],
  ["Blah"]: [],
  ["Another"]: []
};

element("kanban-example", {
  view,
  properties: {
    initialState: {
      default: DEFAULT_STATE
    }
  }
});
