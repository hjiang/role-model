module.exports = {
  "extends": "airbnb",
  "installedESLint": true,
  "plugins": [
    "node"
  ],
  "env": {
    "es6": true,
    "node": true

  },
  "rules": {
    "no-console": 0,
    "node/no-deprecated-api": "error",
    "node/no-missing-import": "error",
    "node/no-missing-require": "error",
    "node/no-unpublished-import": "error",
    "node/no-unpublished-require": "error",
    "node/no-unsupported-features": ["error", {"version": 4}],
    "node/process-exit-as-throw": "error",
    "node/shebang": "error"
  }
};
