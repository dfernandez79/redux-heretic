const snakeCase = require('lodash/snakeCase');

function typeFormat(name, prefix = '') {
  const pre = prefix.length === 0 ? '' : `${snakeCase(prefix).toUpperCase()}_`;
  return `${pre}${snakeCase(name).toUpperCase()}`;
}

module.exports = typeFormat;
module.exports.default = typeFormat;
