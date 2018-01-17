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
  if (isObject(spec) && isFunction(spec.createAction)) {
    return payload => spec.createAction(type, payload);
  }
  return payload => defaultCreateAction(type, payload);
}

function h(spec, prefix = '') {
  const names = Object.keys(spec);
  const actions = {};

  for (const name of names) {
    const type = actionTypeName(prefix, name);
    actions[name] = actionFactory(type, spec[name]);
    actions[name].type = type;
  }

  return {
    actions
  };
}

module.exports = h;
module.exports.default = h;
