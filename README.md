# Redux Heretic

Reduce the amount of boilerplate code needed to create a [Redux] app, by merging
actions and reducers into the same definition 🙀.

## Examples

### Counter

Plain [redux] counter example:

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

Using _redux-heretic_:

Each key of the object passed to _redux-heretic_ contains a reducer function.
The returned object has action factories and a reducer that will apply the state
change based on the action type.

```js
import h from 'redux-heretic';

const {actions, reducer} = h(
  {
    increment: state => state + 1,
    decrement: state => state - 1
  },
  {initialState: 0}
);

const store = Redux.createStore(reducer);
store.dispatch(actions.increment());
```

### Custom action factory

Each value in the object passed to _redux-heretic_ accepts a function or an
object.

The function variant specifies a reducer. The object variant allows to pass an
action factory and/or a reducer.

```js
const {actions, reducer} = h(
  {
    add: {
      // This will be used to create the action
      // type & actions are values passed by the library:
      //
      // type = the action type, by default the library converts
      // 'add' to UPPER_SNAKE_CASE, e.g ADD
      //
      // actions = the same actions object returned by
      // the h function, so you can access other actions.
      // See the async example bellow.
      create: (type, actions, value) => ({type, amount: value}),

      // This will be used to return the new state when
      // the action is received
      reduce: (state, action) => state + action.amount
    }
  },
  {initialState: 0}
);

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
const {actions, reducer} = h(
  {
    increment: state => state + 1,
    decrement: state => state - 1
  },
  {
    initialState: 0,

    // every action type is prefixed with COUNTER_
    prefix: 'counter'
  }
);

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
  increment: {
    create(type, actions, payload) {
      return dispatch => {
        // use the actions objects to easily create other actions,
        // note that you can also hardcode {type: 'START_INCREMENT'}
        dispatch(actions.startIncrement());
        setTimeout(() => dispatch(actions.finishIncrement()), 1000);
      }
    }
    // You can skip the reducer function if you don't want it
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
},
{  
  initialState: {
    requestInProgress: false,
    value: 0
  }
});

const store = Redux.createStore(reducer, applyMiddleware(thunk));
store.dispatch(actions.increment());
```

### Custom action type names

By default, action names have the format: `PREFIX_ACTION_NAME`.

For example `startIncrement` with the prefix `counter`, becomes
`COUNTER_START_INCREMENT`.

To change the format pass a `typeFormat` function to the options:

```js
import h from 'redux-heretic';

const {actions, reducer} = h(
  {
    startIncrement(state) {
      return Object.assign({}, state, {
        requestInProgress: true
      });
    }
  },
  {
    initialState: {
      requestInProgress: false
    },
    prefix: 'a',
    typeFormat: (name, prefix) => `${name}/${prefix}`
  }
);

console.log(actions.startIncrement.type);
// shows: startIncrement/a
```

# License

MIT

[redux]: https://redux.js.org/
[redux-thunk]: https://github.com/gaearon/redux-thunk
