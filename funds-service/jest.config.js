// const { createDefaultPreset } = require("ts-jest");

// const tsJestTransformCfg = createDefaultPreset().transform;

// /** @type {import("jest").Config} **/
// module.exports = {
//   testEnvironment: "node",
//   transform: {
//     ...tsJestTransformCfg,
//   },
// };
/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json"
      }
    ]
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  roots: ["<rootDir>"],

  // ✅ Add coverage options
  collectCoverage: true,
  collectCoverageFrom: [
    "infrastructure/api/fundRouter.ts"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"]
};

