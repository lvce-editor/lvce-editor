import * as config from '@lvce-editor/eslint-config'

const disableConfiguredRules = (prefix) => {
  const entries = config.default.flatMap((item) => Object.keys(item.rules || {}))
  return Object.fromEntries(entries.filter((rule) => rule.startsWith(prefix)).map((rule) => [rule, 'off']))
}

export default [
  ...config.default,
  ...config.recommendedTsconfig,
  ...config.recommendedActions,
  ...config.recommendedRegex,
  {
    files: ['packages/shared-process/**/*.{ts,js}'],
    rules: {
      ...disableConfiguredRules('@cspell/'),
      ...disableConfiguredRules('jest/'),
      ...disableConfiguredRules('perfectionist/'),
      ...disableConfiguredRules('regex/'),
      ...disableConfiguredRules('sonarjs/'),
      ...disableConfiguredRules('unicorn/'),
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-implied-eval': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      'no-console': 'off',
      'no-empty': 'off',
      'no-restricted-syntax': 'off',
      'no-unassigned-vars': 'off',
      'no-useless-escape': 'off',
      'prefer-destructuring': 'off',
      'prefer-const': 'off',
      'regex/hoist-regex': 'error',
    },
  },
]
