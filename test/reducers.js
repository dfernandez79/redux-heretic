const test = require('ava');
const h = require('..');

test('Apply reducer', t => {
  const {actions, reducer} = h({
    increment: (state = 0) => state + 1,
    decrement: (state = 0) => state - 1
  });

  t.is(reducer(0, actions.increment()), 1);
  t.is(reducer(3, actions.decrement()), 2);
});

test('Ignore reducer for unknown actions', t => {
  const {reducer} = h({
    increment: (state = 0) => state + 1
  });

  t.is(reducer(0, {type: 'OTHER'}), 0);
});

test('Use action prefix', t => {
  const {reducer} = h({
    prefix: 'prefix',
    increment: (state = 0) => state + 1
  });

  t.is(reducer(0, {type: 'PREFIX_INCREMENT'}), 1);
});

test('Ignore undeclared reducer', t => {
  const {actions, reducer} = h({
    increment: {
      create(type) {
        return {type};
      }
    }
  });

  t.is(reducer('SOME STATE', actions.increment()), 'SOME STATE');
});

test('Use custom action factory', t => {
  const {actions, reducer} = h({
    add: {
      create(type, value) {
        return {type, value};
      },
      reduce(state, {value}) {
        return state + value;
      }
    }
  });

  t.is(reducer(2, actions.add(2)), 4);
});

test('Return the initial state when called with undefined', t => {
  const {actions, reducer} = h({
    initialState: 'INITIAL STATE',
    update(state) {
      return state;
    }
  });

  t.is(reducer(undefined, {type: 'XYZ'}), 'INITIAL STATE');
  t.is(reducer(undefined, actions.update()), 'INITIAL STATE');
});

test('If state is undefined initialize with initial state', t => {
  const {actions, reducer} = h({
    initialState: 2,
    add(state, {value}) {
      return state + value;
    }
  });

  t.is(reducer(undefined, actions.add({value: 2})), 4);
});
