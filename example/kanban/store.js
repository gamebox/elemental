import { sink } from "../../src/index.js";
import {
  COLUMN_CARD_DROPPED,
  COLUMN_CARD_ADDED,
  CARD_DRAG_STARTED,
  CARD_DRAGGED_OVER,
  CARD_DRAG_ENDED,
  CARD_EDIT_TRIGGERED,
  MODAL_CLOSED
} from "./constants.js";

const storeProperties = {
  columns: {
    default: {}
  },
  dragState: {
    default: null
  },
  selectedCard: {
    default: null
  }
};

const insertIntoColumn = (card, idx, column) => [
  ...column.slice(0, idx),
  card,
  ...column.slice(idx)
];

sink("kanban-store", {
  properties: storeProperties,
  actionHandlers: {
    [COLUMN_CARD_DROPPED]: ({ state, setState, action }) => {
      const board = state.columns;
      const { source, id, idx, column: col } = {
        ...state.dragState,
        ...action.payload
      };
      if (source === col) {
        const card = board[col].find(c => c.id === id);
        const column = board[col].filter(c => c.id !== id);
        const newCol = insertIntoColumn(card, idx, column);
        const newBoard = { ...board, [col]: newCol };
        setState({
          columns: newBoard
        });
      } else {
        const newBoard = {
          ...board,
          [source]: board[source].filter(c => c.id !== id),
          [col]: insertIntoColumn(
            board[source].find(c => c.id === id),
            idx,
            board[col]
          )
        };

        setState({
          columns: newBoard
        });
      }
    },
    [CARD_DRAG_STARTED]: ({ state, setState, action }) => {
      const { source, id, idx } = action.payload;
      setState({
        dragState: {
          source,
          id,
          idx
        }
      });
    },
    [CARD_DRAGGED_OVER]: ({ state, setState, action }) => {
      setState({
        dragState: {
          ...state.dragState,
          ...action.payload
        }
      });
    },
    [CARD_DRAG_ENDED]: ({ state, setState, action }) => {
      setTimeout(() => {
        setState({
          dragState: undefined
        });
      }, 0);
    },
    [COLUMN_CARD_ADDED]: ({ state, setState, action }) => {
      const { title, column } = action.payload;
      const card = { id: Date.now(), title };
      const col = state.columns[column];
      const idx = col.length;
      const newBoard = {
        ...state.columns,
        [column]: [card, ...col]
      };
      setState({
        columns: newBoard
      });
    },
    [CARD_EDIT_TRIGGERED]: ({ state, setState, action }) => {
      console.log("store", CARD_EDIT_TRIGGERED, state);
      const { column, idx } = action.payload;
      const col = state.columns[column];
      const card = col[idx];

      setState({
        selectedCard: card
      });
    },
    [MODAL_CLOSED]: ({ setState }) => {
      setState({
        selectedCard: null
      });
    }
  },
  mapPropsToState: props => {
    return props;
  }
});
