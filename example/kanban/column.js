import { element } from "../../src/index.js";
import { html } from "../../web_modules/lit-html.js";
import { repeat } from "../../web_modules/lit-html/directives/repeat.js";
import {
  COLUMN_CARD_DROPPED,
  COLUMN_CARD_ADDED,
  CARD_DRAGGED_OVER
} from "./constants.js";

import "./card.js";

const columnView = ({ columnTitle, cards = [] }, dispatch) => html`
  <div
    class="column"
    @drop=${e => {
      dispatch(COLUMN_CARD_DROPPED);
      e.preventDefault();
    }}
    @dragover=${e => {
      dispatch(CARD_DRAGGED_OVER, { column: columnTitle });
      e.preventDefault();
    }}
  >
    <div class="columnHeader">
      <h2
        class="column__title"
        @click=${() => /* dispatch(COLUMN_EDIT_TITLE, { column: columnTitle }) */ {}}
      >
        ${columnTitle}
      </h2>
      <i
        class="fas fa-plus columnIcon"
        @click=${() => {
          dispatch(COLUMN_CARD_ADDED, {
            title: "New card",
            column: columnTitle
          });
        }}
        >...</i
      >
    </div>
    <div class="columnCardList">
      ${repeat(
        cards,
        card => card.id,
        (card, index) => html`
          <kanban-card
            .card=${card}
            .index=${index}
            .column=${columnTitle}
            dragState="@store/dragState"
          ></kanban-card>
        `
      )}
    </div>
  </div>
`;

const columnStyles = /* css */ `
.column {
  background-color: #ebecf0;
  padding: .5rem;
  border-radius: 3px;
  flex: auto;
  margin-right: 1rem;
  border: 1px solid #DADADA;
  max-width: 20vw;
  display: flex;
  flex-direction: column;
  max-height: 100%
}

h2 {
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  margin: 0 0 8px;
}

.columnHeader {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  font-size: 20px;
  line-height: 24px;
}

.columnIcon {
  display: block;
  align-self: center;
  margin-top: -20px;
  color: #6b778c;
  cursor: pointer;
}

.column:last-of-type {
  margin-right: 0;
}

.columnCardList {
  overflow-y: auto;
  min-height: 80px;
}

.columnCardList:empty:hover {
  background-color: #DEDEDE;
}
`;

element("kanban-column", {
  view: columnView,
  styles: columnStyles,
  properties: {
    columnTitle: {
      default: ""
    },
    cards: {
      default: []
    }
  }
});
