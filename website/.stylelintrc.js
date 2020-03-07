module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
    'stylelint-config-css-modules',
    'stylelint-prettier/recommended',
    'stylelint-scss',
  ],
  ignoreFiles: ['**/*.tsx', '**/*.jsx'],
  rules: {
    'at-rule-no-unknown': null,
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested'],
        except: ['blockless-after-blockless'],
      },
    ],
    'no-descending-specificity': null,
  },
};
