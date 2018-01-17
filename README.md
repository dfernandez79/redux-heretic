# Redux Heretic

Reduce the amount of boilerplate code needed to create a [Redux] app, by merging
actions and reducers into the same definition 🙀.

## Examples

### Counter

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

```js
const {actions, reducer} = h({
  initialState: 0,
  add: {
    create: (type, value) => ({type, amount: value}),
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

```js
const {actions, reducer} = h({
  initialState: 0,
  prefix: 'counter',
  increment: state => state + 1,
  decrement: state => state - 1
});

console.log(actions.increment.type); // --> COUNTER_INCREMENT
```

[redux]: https://redux.js.org/
