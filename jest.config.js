/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(mjs?|js?|ts?)$",
  transform: {
    "^.+\\.mjs$": "babel-jest",
  },
  moduleFileExtensions: ["js", "ts", "mjs"],
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*"],
};
