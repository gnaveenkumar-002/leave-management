import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/tests"],

  testMatch: ["**/*.test.ts"],

  moduleFileExtensions: ["ts", "js"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
  ],

  coverageDirectory: "coverage",

  coverageReporters: ["text", "text-summary", "lcov"],

  clearMocks: true,

  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
  ],
};

export default config;
