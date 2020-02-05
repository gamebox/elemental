import { element } from "../../src/index.js";
import { html } from "../../web_modules/lit-html.js";
import { styleMap } from "../../web_modules/lit-html/directives/style-map.js";
import {
  CARD_EDIT_TRIGGERED,
  CARD_DRAG_STARTED,
  CARD_DRAGGED_OVER,
  CARD_DRAG_ENDED
} from "./constants.js";
import MD5 from "./md5.js";

const gravatarUrl = email =>
  `https://www.gravatar.com/avatar/${MD5(email.trim().toLowerCase())}`;

const cardView = (
  { dragState, card, column, index },
  dispatch,
  getClientRect
) => {
  const beingDragged =
    (dragState && dragState.id && dragState.id === card.id) || false;

  if (beingDragged) {
    console.log("DRAGGING", card.id);
  }

  const clientRect = getClientRect();
  console.log(clientRect);

  return !card || beingDragged
    ? html`
        <div className="cardPlaceholder"></div>
      `
    : html`
        <div
          draggable="true"
          class="card"
          @dblclick=${() => {
            console.log(CARD_EDIT_TRIGGERED);
            dispatch(CARD_EDIT_TRIGGERED, { id: card.id, column, idx: index });
          }}
          @dragstart=${() => {
            dispatch(CARD_DRAG_STARTED, {
              id: card.id,
              source: column,
              idx: index
            });
          }}
          @dragend=${() => {
            dispatch(CARD_DRAG_ENDED, { idx: index, column });
          }}
          @dragover=${e => {
            dispatch(CARD_DRAGGED_OVER, { idx: index, column });
            e.preventDefault();
          }}
        >
          <!-- <img
            src=${gravatarUrl(card.email || "")}
            class="card__avatar"
            alt=${card.userName || "Creator' Avatar"}
          />
          <h3 className="card__title">
            ${card.title}
          </h3>
          <hr className="card__divider" /> -->
          <span className="card__body">
            ${card.title || "No title"}
          </span>
        </div>
      `;
};

const cardStyles = /* css */ `
.card {
  background-color: white;
  padding: 6px 8px 2px;
  box-shadow: 0 1px 0 rgba(9,30,66,.25);
  max-width: 300px;
  min-height: 20px;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid #DEDEDE;
  font-size: 14px;
  margin-bottom: 8px;
}

.cardPlaceholder {
  background-color: #DEDEDE;
  height: 6rem;
  border-radius: 6px;
}
`;

element("kanban-card", {
  view: cardView,
  styles: cardStyles,
  properties: {
    dragState: {
      default: null
    },
    card: {
      default: {}
    },
    column: {
      default: null
    },
    index: {
      default: null
    }
  }
});
