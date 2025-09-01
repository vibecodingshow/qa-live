module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'dist/**/*.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ]
};