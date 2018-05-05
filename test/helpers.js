const test = require('ava');
const isFunction = require('lodash/isFunction');
const {
  actionFactories,
  defaultActionFactory,
  defaultActionFactories,
  reducer
} = require('../helpers');

test('Create action factories', t => {
  const actions = actionFactories({
    someAction: type => ({type, custom: true}),
    myOtherAction: type => ({type, custom: true})
  });

  t.is(actions.someAction.type, 'SOME_ACTION');
  t.is(actions.myOtherAction.type, 'MY_OTHER_ACTION');
  t.true(isFunction(actions.someAction));
  t.true(isFunction(actions.myOtherAction));
  t.deepEqual(actions.someAction(), {type: 'SOME_ACTION', custom: true});
});

test('Create actions with string prefix', t => {
  const actions = actionFactories(
    {
      someAction: type => ({type, custom: true})
    },
    'pre'
  );
  t.is(actions.someAction.type, 'PRE_SOME_ACTION');
});

test('Create actions with prefix using options', t => {
  const actions = actionFactories(
    {
      someAction: type => ({type, custom: true})
    },
    {prefix: 'pre'}
  );
  t.is(actions.someAction.type, 'PRE_SOME_ACTION');
});

test('Reference to other action names', t => {
  const actions = actionFactories(
    {
      someAction: (type, actions) => ({type, other: actions.other.type}),
      other: type => ({type})
    },
    'pre'
  );
  t.deepEqual(actions.someAction(), {
    type: actions.someAction.type,
    other: actions.other.type
  });
});

test('Custom type name format', t => {
  const actions = actionFactories(
    {oneAction() {}},
    {
      prefix: 'a',
      typeFormat(name, prefix) {
        return `${name}/${prefix}`;
      }
    }
  );

  t.is(actions.oneAction.type, 'oneAction/a');
});

test('Default action factory', t => {
  const actions = actionFactories({someAction: defaultActionFactory});

  t.deepEqual(actions.someAction({value: 123}), {
    type: actions.someAction.type,
    value: 123
  });
});

test('Default action factories', t => {
  const actions = actionFactories(
    defaultActionFactories('action1', 'action2', 'action3')
  );
  t.true(isFunction(actions.action1));
  t.true(isFunction(actions.action2));
  t.true(isFunction(actions.action3));
  t.deepEqual(actions.action1({value: 1}), {
    type: actions.action1.type,
    value: 1
  });
  t.deepEqual(actions.action2({value: 2}), {
    type: actions.action2.type,
    value: 2
  });
  t.deepEqual(actions.action3({value: 3}), {
    type: actions.action3.type,
    value: 3
  });
});

test('Reducer with initial state', t => {
  const actions = actionFactories({increment: defaultActionFactory});
  const reducerFn = reducer(
    {
      [actions.increment.type]: (state, {value}) => state + value
    },
    {initialState: 0}
  );

  t.is(reducerFn(undefined, actions.increment({value: 1})), 1);
  t.is(reducerFn(2, actions.increment({value: 1})), 3);
});

test('Ignore unknown action', t => {
  const reducerFn = reducer({
    TEST: state => state + 1
  });

  t.is(reducerFn(1, 'XYZ'), 1);
});
