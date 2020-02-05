import { element } from "../../src/index.js";
import { html, nothing } from "../../web_modules/lit-html.js";
import { MODAL_CLOSED } from "./constants.js";

const view = ({ card }, dispatch) =>
  card === null
    ? nothing
    : html`
        <div class="modal-overlay" @click=${() => dispatch(MODAL_CLOSED)}>
          <div class="modal">
            <div class="window-header">
              <span
                class="window-header-icon icon-lg icon-card js-card-header-icon"
              ></span>
              <div class="window-title">
                <h2 class="card-detail-title-assist js-title-helper" dir="auto">
                  ${card.title}
                </h2>
                <textarea
                  class="mod-card-back-title js-card-detail-title-input"
                  dir="auto"
                  style="overflow: hidden; overflow-wrap: break-word; height: 32px;"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      `;

const styles = /* css */ `
.modal-overlay {
  background: rgba(0,0,0,.64);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 20;
  overflow-y: auto;
}

.modal {
  background-color: #f4f5f7;
  border-radius: 2px;
  margin: 48px 0 80px;
  overflow: hidden;
  position: relative;
  width: 768px;
  min-height: 200px;
  z-index: 25;
}
`;

element("kanban-card-modal", {
  view,
  styles,
  properties: {
    card: {
      default: null
    }
  }
});
