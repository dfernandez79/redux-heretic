# Redux Heretic

Reduce the amount of boilerplate code needed to create a [Redux] app, by merging
actions and reducers into the same definition 🙀.

## Examples

### Counter

In this example, each key of the object passed to redux-heretic contains a
reducer function. The returned object has action factories and a reducer that
will apply the state change based on the action type.

Before:

```js
// Reducer
function counter(state, action) {
  if (typeof state === 'undefined') {
    return 0;
  }
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// Action factory
function increment() {
  return {type: 'INCREMENT'};
}

function decrement() {
  return {type: 'DECREMENT'};
}

const store = Redux.createStore(counter);
store.dispatch(increment());
```

After:

```js
import h from 'redux-heretic';

const {actions, reducer} = h({
  initialState: 0,
  increment: state => state + 1,
  decrement: state => state - 1
});

const store = Redux.createStore(reducer);
store.dispatch(actions.increment());
```

### Custom action factory

You can pass a function used as a reducer, or you can use an object to specify
the action factory and reducer.

```js
const {actions, reducer} = h({
  initialState: 0,
  add: {
    create: (type, actions, value) => ({type, amount: value}),
    reduce: (state, action) => state + action.amount
  }
});

const store = Redux.createStore(reducer);

// add(10) calls the create function with: create('ADD', 10) to
// get value of the action
store.dispatch(actions.add(10));

// you can also access to the action type
console.log(action.add.type); // --> ADD
```

### Prefix action types

When combining reducers, you need to make sure that action types are unique. You
can pass a prefix, and all the action types will use it.

```js
const {actions, reducer} = h({
  initialState: 0,
  prefix: 'counter',
  increment: state => state + 1,
  decrement: state => state - 1
});

console.log(actions.increment.type); // --> COUNTER_INCREMENT
```

### Async action with redux-thunk

You can define an action factory without a reducer. Also, each action factory
receives an `actions` instance, so you can create other actions to dispatch.

This is helpful when using libraries like [redux-thunk].

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import h from 'redux-heretic';

const {actions, reducer} = h({
  initialState: {
    requestInProgress: false,
    value: 0
  },

  increment: {
    create(type, actions, payload) {
      return dispatch => {
        dispatch(actions.startIncrement());
        setTimeout(() => dispatch(actions.finishIncrement()), 1000);
      }
    }
  },

  startIncrement(state) {
    return Object.assign({}, state, {
      requestInProgress: true
    });
  }

  finishIncrement(state) {
    return Object.assign({}, state, {
      requestInProgress: false,
      value: state.value + 1
    });
  }
});

const store = Redux.createStore(reducer, applyMiddleware(thunk));
store.dispatch(actions.increment());
```

# License

MIT

[redux]: https://redux.js.org/
[redux-thunk]: https://github.com/gaearon/redux-thunk
