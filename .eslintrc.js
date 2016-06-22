module.exports = {
  extends: ['airbnb', 'plugin:node/recommended'],
  "installedESLint": true,
  plugins: [
    'node',
  ],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'no-console': 0,
  },
};
