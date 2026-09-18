export default {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    // Existing BEM classes and component names are intentional.
    "selector-class-pattern": null,
    // Keep clip for the existing screen-reader-only fallback.
    "property-no-deprecated": [true, { ignoreProperties: ["clip"] }],
    "no-descending-specificity": null,
  },
};
