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
  const {actions} = h({
    prefix: 'test',
    someAction() {}
  });

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

test('Ignore non-functions', t => {
  const result = h({x: 1});

  t.is(result.actions.x, undefined);
});

test('Ignore objects without reduce and create', t => {
  const result = h({object: {x: 1, y: 2}});
  t.is(result.actions.object, undefined);
});

test('Create action for reducer', t => {
  const result = h({some: {reduce: state => state}});

  t.true(isFunction(result.actions.some));
});

test('Pass other actions to the action factory', t => {
  const {actions} = h({
    oneAction(state) {
      return state + 1;
    },
    otherAction: {
      create(type, actions, payload) {
        return Object.assign(
          {type, otherType: actions.oneAction().type},
          payload
        );
      }
    }
  });

  t.deepEqual(
    {type: 'OTHER_ACTION', otherType: 'ONE_ACTION', test: 123},
    actions.otherAction({test: 123})
  );
});
