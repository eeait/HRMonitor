module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "prettier",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-native", "react-hooks"],
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": "off",
    "react/function-component-definition": "off",
    // "no-unused-vars": "off",
    "no-console": 0,
    // "import/no-extraneous-dependencies": [
    //   "error",
    //   { devDependencies: true },
    // ],
    "import/no-extraneous-dependencies": "off",
  },
}
