import { sink } from "../../src/sink.js";
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

const findNextId = (todos = []) =>
  todos.reduce((acc, t) => (t.id > acc ? t.id : acc), 0) + 1;
const newTodo = (id, text) => ({ id, text, complete: false });

sink("todo-store", {
  properties: {
    todos: {
      default: []
    },
    editState: {
      default: null
    },
    visibilityFilter: {
      default: "all"
    }
  },
  actionHandlers: {
    [TODO_LIST_ADDED_TODO]: ({ state, setState, action }) => {
      setState({
        todos: [newTodo(state.nextId, action.payload.text), ...state.todos],
        nextId: state.nextId + 1
      });
    },
    [TODO_COMPLETED]: ({ state, setState, action }) => {
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
    },
    [TODO_DELETED]: ({ state, setState, action }) => {
      const idx = state.todos.findIndex(t => t.id === action.payload.id);
      console.log("idx", idx, action);
      setState({
        todos: [...state.todos.slice(0, idx), ...state.todos.slice(idx + 1)]
      });
    },
    [TODO_SELECTED]: ({ setState, action }) => {
      console.log(TODO_SELECTED, action);
      setState({
        editState: action.payload.id
      });
    },
    [TODO_UNSELECTED]: ({ state, setState, action }) => {
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
    },
    [TODO_LIST_TOGGLED_COMPLETE_ALL]: ({ state, setState }) => {
      const complete = state.todos.find(t => !t.complete) !== undefined;
      setState({
        todos: state.todos.map(t => ({
          ...t,
          complete
        }))
      });
    },
    [TODO_LIST_VISIBILTY_FILTER_CHANGED]: ({ setState, action }) => {
      setState({
        visibilityFilter: action.payload.filter
      });
    },
    [TODO_LIST_CLEARED_COMPLETED]: ({ state, setState }) => {
      setState({
        todos: state.todos.filter(t => !t.complete)
      });
    }
  },
  mapPropsToState: props => ({
    ...props,
    nextId: findNextId(props.todos)
  })
});
