const test = require('ava');
const isFunction = require('lodash/isFunction');
const h = require('..');

test('Action type names', t => {
  const {actions} = h({
    someAction() {},
    myOtherAction() {}
  });

  t.is(actions.someAction.type, 'SOME_ACTION');
  t.is(actions.myOtherAction.type, 'MY_OTHER_ACTION');
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

test('Custom action factory', t => {
  const {actions} = h({
    someAction: {
      create(type) {
        return {type, custom: true};
      }
    }
  });

  t.deepEqual(
    {type: actions.someAction.type, custom: true},
    actions.someAction()
  );
});
