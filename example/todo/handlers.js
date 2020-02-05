import {
  TODO_LIST_ADDED_TODO,
  TODO_LIST_TOGGLED_COMPLETE_ALL,
  TODO_LIST_VISIBILTY_FILTER_CHANGED,
  TODO_LIST_CLEARED_COMPLETED,
  TODO_COMPLETED,
  TODO_DELETED,
  TODO_SELECTED,
  TODO_UNSELECTED
} from "./constants.js";

const newTodo = (id, text) => ({ id, text, complete: false });

const todoListAddedTodo = ({ state, setState, action }) => {
  setState({
    todos: [newTodo(state.nextId, action.payload.text), ...state.todos],
    nextId: state.nextId + 1
  });
};

const todoCompleted = ({ state, setState, action }) => {
  const idx = state.todos.findIndex(t => t.id === action.payload.id);
  setState({
    todos: [
      ...state.todos.slice(0, idx),
      {
        ...state.todos[idx],
        complete:
          state.todos[idx].complete === undefined
            ? true
            : !state.todos[idx].complete
      },
      ...state.todos.slice(idx + 1)
    ]
  });
};

const todoDeleted = ({ state, setState, action }) => {
  const idx = state.todos.findIndex(t => t.id === action.payload.id);
  console.log("idx", idx, action);
  setState({
    todos: [...state.todos.slice(0, idx), ...state.todos.slice(idx + 1)]
  });
};

const todoSelected = ({ setState, action }) => {
  console.log(TODO_SELECTED, action);
  setState({
    editState: action.payload.id
  });
};

const todoUnselected = ({ state, setState, action }) => {
  const idx = state.todos.findIndex(t => t.id === action.payload.id);
  setState({
    todos: [
      ...state.todos.slice(0, idx),
      {
        ...state.todos[idx],
        text: action.payload.text
      },
      ...state.todos.slice(idx + 1)
    ],
    editState: null
  });
};

const todoListToggledCompleteAll = ({ state, setState }) => {
  const complete = state.todos.find(t => !t.complete) !== undefined;
  setState({
    todos: state.todos.map(t => ({
      ...t,
      complete
    }))
  });
};

const todoListVisibiltyFilterChanged = ({ setState, action }) => {
  setState({
    visibilityFilter: action.payload.filter
  });
};

const todoListClearedCompleted = ({ state, setState }) => {
  setState({
    todos: state.todos.filter(t => !t.complete)
  });
};

export default {
  [TODO_LIST_ADDED_TODO]: todoListAddedTodo,
  [TODO_COMPLETED]: todoCompleted,
  [TODO_DELETED]: todoDeleted,
  [TODO_SELECTED]: todoSelected,
  [TODO_UNSELECTED]: todoUnselected,
  [TODO_LIST_TOGGLED_COMPLETE_ALL]: todoListToggledCompleteAll,
  [TODO_LIST_VISIBILTY_FILTER_CHANGED]: todoListVisibiltyFilterChanged,
  [TODO_LIST_CLEARED_COMPLETED]: todoListClearedCompleted
};
