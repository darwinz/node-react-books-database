module.exports = {
  env: {
    commonjs: true,
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'space-before-function-paren': 'off',
    'curly': 'off'
  }
}
