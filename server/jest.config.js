module.exports = {
  roots: [
    "<rootDir>/src/",
    "<rootDir>/tests/"
  ],
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/interfaces/**",
    "!src/routes/**",
    "!src/helpers/paths.ts",
    "!src/helpers/constants.ts",
    "!src/main.ts"
  ],
  "clearMocks": true,
  "coverageDirectory": "report/unit",
  "preset": "ts-jest",
  "collectCoverage": true,
  "automock": false,
  "testEnvironment": "node",
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "transformIgnorePatterns": [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|ts|tsx)$"
  ]
}
