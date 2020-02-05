import { element } from "../../src/index.js";
import { html } from "../../web_modules/lit-html.js";
import { repeat } from "../../web_modules/lit-html/directives/repeat.js";

import "./column.js";
import { BOARD_COLUMN_ADDED } from "./constants.js";

const view = (props, dispatch) => {
  const { columns } = props;
  return html`
    <div class="board">
      ${repeat(
        Object.keys(columns),
        columnName =>
          [columnName, ...columns[columnName].map(card => card.id)].join(" "),
        columnName => html`
          <kanban-column
            .columnTitle=${columnName}
            .cards=${columns[columnName]}
          ></kanban-column>
        `
      )}
      <div class="another-list-container">
        <button
          class="another-list-button"
          @click=${() => dispatch(BOARD_COLUMN_ADDED)}
        >
          Add another list
        </button>
      </div>
    </div>
  `;
};

const styles = /* css */ `
.board {
  background-color: rgb(210, 144, 52);
  padding: 2rem;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  overflow-x: auto;
}
kanban-column {
  min-width: 200px;
  margin-right: 16px;
}
kanban-column:last-of-type {
  margin-right: 0;
}
`;

const boardProperties = {
  columns: {
    default: {}
  }
};

element("kanban-board", {
  view,
  styles,
  properties: boardProperties
});
