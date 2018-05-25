module.exports = {
  extends: ['airbnb', 'plugin:node/recommended'],
  plugins: [
    'node',
  ],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'no-console': 0,
    'class-methods-use-this': ['error', {
      'exceptMethods': [
        'receivingPath',
        'createMessageContext'
      ]
    }],
    "comma-dangle": ["error", "never"]
  },
};
