module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  // Only use mocks for coverage tests, not for direct tests
  moduleNameMapper: {
    // No mocks by default
  },
  // Allow ES modules
  transformIgnorePatterns: [
    '/node_modules/(?!.*\\.mjs$)'
  ],
  // Setup files to run before tests
  setupFiles: ['<rootDir>/tests/setup.js'],
};