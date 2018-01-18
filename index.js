const snakeCase = require('lodash/snakeCase');
const isFunction = require('lodash/isFunction');
const isObject = require('lodash/isObject');
const isUndefined = require('lodash/isUndefined');

function h(spec) {
  const actions = {};
  const reducers = {};

  Object.keys(spec).forEach(name => {
    if (!isSpecProperty(name)) {
      const type = actionTypeName(spec.prefix, name);
      const currentSpec = spec[name];

      addAction(actions, name, type, currentSpec);
      addReducer(reducers, type, currentSpec);
    }
  });

  return {
    actions,
    reducer: composeReducers(reducers, spec.initialState)
  };
}

module.exports = h;
module.exports.default = h;

function composeReducers(reducers, initialState) {
  return (state, action) => {
    state = isUndefined(state) ? initialState : state;
    const fn = reducers[action.type];
    if (isFunction(fn)) {
      return fn(state, action);
    }
    return state;
  };
}

function actionTypeName(prefix = '', name) {
  const pre = prefix.length === 0 ? '' : `${snakeCase(prefix).toUpperCase()}_`;
  return `${pre}${snakeCase(name).toUpperCase()}`;
}

function isSpecProperty(name) {
  return name === 'prefix' || name === 'initialState';
}

function addReducer(reducers, type, currentSpec) {
  const reducer = createReducer(currentSpec);
  if (reducer) {
    reducers[type] = reducer;
  }
}

function createReducer(spec) {
  if (isFunction(spec)) {
    return spec;
  } else if (isObject(spec) && isFunction(spec.reduce)) {
    return spec.reduce;
  }
  return undefined;
}

function addAction(actions, name, type, currentSpec) {
  const factory = createActionFactory(type, actions, currentSpec);
  if (factory) {
    factory.type = type;
    actions[name] = factory;
  }
}

function createActionFactory(type, actions, spec) {
  const isObj = isObject(spec);
  if (isObj && isFunction(spec.create)) {
    return (...args) => spec.create(type, actions, ...args);
  } else if (isFunction(spec) || (isObj && isFunction(spec.reduce))) {
    return payload => defaultCreateAction(type, payload);
  }
  return undefined;
}

function defaultCreateAction(type, payload) {
  return Object.assign({type}, payload);
}
