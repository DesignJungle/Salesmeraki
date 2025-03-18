const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
  presets: ['next/babel'],
  babelrc: false,
  configFile: false,
});