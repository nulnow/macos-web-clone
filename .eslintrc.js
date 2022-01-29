module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
    'airbnb-typescript'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    browser: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": true
        }
      }
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/object-curly-spacing': 'off',
    "react/jsx-filename-extension": [0],
    "import/extensions": "off",
    '@typescript-eslint/no-loop-func': 'off',
    "@typescript-eslint/explicit-member-accessibility": ["error"],
    "@typescript-eslint/explicit-function-return-type": ["error"],
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    "@typescript-eslint/typedef": [
      "error",
      {
        "arrowParameter": false,
        "variableDeclaration": true,
        "variableDeclarationIgnoreFunction": true,
      }
    ]
  },
}
