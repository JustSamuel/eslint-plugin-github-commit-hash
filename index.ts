// eslint-plugin-check-git-commit-hash/index.js
module.exports = {
  rules: {
    'check-git-commit-hash': require('./lib/rules/check-git-commit-hash'),
  },
  configs: {
    recommended: {
      rules: {
        'check-git-commit-hash': 'error',
      },
    },
  },
};
