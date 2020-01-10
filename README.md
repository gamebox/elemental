# Elemental JS

A lightweight, functional-first library to help author web apps with portable web components 

## Principles

Instead of trying to use a single abstraction with a single API to create composable units of functionality for your app, provide separate, purpose-built abstractions that don't allow for intermingling of concerns.

### Example

An `element` is only a visual piece of UI that accepts props(inputs), and renders DOM that emits custom events.
A `sink` is a wrapper that only listens to a list of specific events and updates an immutable model.  It exposes a select set of properties that are selectable by children elements.  It has no view, only a 
shadow root.
A `transform` can only intercept actions, alter them, and redispatch them.
A `router` can only S