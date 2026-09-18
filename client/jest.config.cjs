module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.test.[jt]s?(x)"],
  setupFiles: ["<rootDir>/test/polyfills.cjs"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: {
    "^.+\\.[cm]?[jt]sx?$": [
      "babel-jest",
      {
        plugins: [require.resolve("./test/importMeta.cjs")],
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/test/styleMock.cjs",
    "\\.(svg|png|jpe?g|gif|webp)$": "<rootDir>/test/fileMock.cjs",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(react-router|cookie|cookie-es|set-cookie-parser)/)",
  ],
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!src/setupTests.js",
    "!src/index.jsx",
  ],
};
