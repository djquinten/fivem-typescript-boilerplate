module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    root: true,
    rules: {
        'no-useless-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        // 'max-len': ["error", { code: 140, ignoreComments: true }],
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-types': 'off',
    },
    env: {
        node: true,
    },
    ignorePatterns: ["**/*.js"]
};