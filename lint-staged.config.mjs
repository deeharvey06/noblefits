export default {
  "*.{js,jsx,cjs,mjs}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "*.{css,scss}": ["stylelint --fix", "prettier --write"],
  "*.{json,md,html,yml,yaml,svg}": "prettier --write --ignore-unknown",
};
