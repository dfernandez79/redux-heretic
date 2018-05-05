const isString = require('lodash/isString');
const mapValues = require('lodash/mapValues');
const typeFormat = require('lodash/identity');
const h = require('.');

function actionFactories(spec, optionsOrPrefix = {}) {
  const options = isString(optionsOrPrefix) ? {prefix: optionsOrPrefix} : optionsOrPrefix;
  return h(mapValues(spec, fn => ({create: fn})), options).actions;
}

function defaultActionFactory(type, actions, payload) {
  return Object.assign({type}, payload);
}

function defaultActionFactories(...names) {
  const result = {};
  names.forEach(name => {
    result[name] = defaultActionFactory;
  });
  return result;
}

function reducer(spec, options = {}) {
  return h(
    mapValues(spec, fn => ({reduce: fn})),
    Object.assign(options, {typeFormat})
  ).reducer;
}

module.exports = {
  actionFactories,
  defaultActionFactory,
  defaultActionFactories,
  reducer
};
