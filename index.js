const snakeCase = require('lodash/snakeCase');
const isFunction = require('lodash/isFunction');
const isObject = require('lodash/isObject');

function defaultCreateAction(type, payload) {
  return {type, ...payload};
}

function actionTypeName(prefix = '', name) {
  const pre = prefix.length === 0 ? '' : `${snakeCase(prefix).toUpperCase()}_`;
  return `${pre}${snakeCase(name).toUpperCase()}`;
}

function actionFactory(type, spec) {
  if (isObject(spec) && isFunction(spec.create)) {
    return (...args) => spec.create(type, ...args);
  }
  return payload => defaultCreateAction(type, payload);
}

function createReducer(spec) {
  if (isFunction(spec)) {
    return spec;
  } else if (isObject(spec) && isFunction(spec.reduce)) {
    return spec.reduce;
  }
  return undefined;
}

function h(spec, prefix = '') {
  const names = Object.keys(spec);
  const actions = {};
  const reducers = {};

  for (const name of names) {
    const type = actionTypeName(prefix, name);
    const currentSpec = spec[name];
    const reducer = createReducer(currentSpec);

    actions[name] = actionFactory(type, currentSpec);
    actions[name].type = type;

    if (reducer) {
      reducers[type] = reducer;
    }
  }

  const reducer = (state, action) => {
    const fn = reducers[action.type];
    if (isFunction(fn)) {
      return fn(state, action);
    }
    return state;
  };

  return {
    actions,
    reducer
  };
}

module.exports = h;
module.exports.default = h;
