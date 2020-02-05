import { sink, createRef } from "../../src/index.js";

sink("some-sink", {
  properties: {
    initialValue: {
      default: 0
    }
  },
  mapPropsToState(props) {
    console.log("mapPropsToState", props);
    return {
      value:
        typeof props.initialValue === "string"
          ? parseInt(props.initialValue)
          : props.initialValue,
      ref: createRef()
    };
  },
  actionHandlers: {
    "SOME_ELEMENT#CLICK": ({ state, setState }) => {
      setState({ value: state.value + 1 });
    }
  }
});
