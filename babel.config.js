// babel.config.js
module.exports = {
  presets: [
    "@babel/preset-flow",
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript',
  ],
};