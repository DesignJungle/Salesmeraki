// Comment out the Babel transformer to prevent conflicts
// const babelJest = require('babel-jest').default;

// module.exports = babelJest.createTransformer({
//   presets: ['next/babel'],
//   babelrc: false,
//   configFile: false,
// });

// Use a simple passthrough transformer for tests
module.exports = {
  process(src) {
    return { code: src };
  },
};
