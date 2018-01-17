const test = require('ava');
const isFunction = require('lodash/isFunction');
const h = require('..');

test('Action type', t => {
  const {actions} = h({
    someAction() {}
  });

  t.is(actions.someAction.type, 'SOME_ACTION');
});

test('Action factory', t => {
  const {actions} = h({
    someAction() {}
  });

  t.true(isFunction(actions.someAction));
  const action = actions.someAction({value: 1});
  t.deepEqual({type: action.type, value: 1}, action);
});

test('Use factory without payload', t => {
  const {actions} = h({
    someAction() {}
  });
  t.deepEqual({type: actions.someAction.type}, actions.someAction());
});

test('Action with prefix', t => {
  const {actions} = h(
    {
      someAction() {}
    },
    'test'
  );

  t.is(actions.someAction.type, 'TEST_SOME_ACTION');
});
