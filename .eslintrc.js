module.exports = {
  root: true,
  extends: [
    'blockabc/typescript'
  ],
  rules: {
    // 因为很多底层库类型问题，ignore 和 any 无可避免
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-explicit-any': 0,
  }
}
