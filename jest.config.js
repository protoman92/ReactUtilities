module.exports = {
  roots: ['<rootDir>', '<rootDir>/src'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupTestFrameworkScriptFile: './test/setup.ts',
  testRegex: '/test/.*.(test|spec)\\.tsx?$',
  collectCoverage: true,
  modulePaths: ['src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: ['node_modules'],
  verbose: true,
  testURL: 'http://localhost/',
};
