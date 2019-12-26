module.exports = {
  // preset: 'ts-jest',
  // testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  globals: {
    'ts-jest': {
      // Disable TS issues while testing
      diagnostics: false,
    },
  },
  // Ensure css module imports can be handled while testing
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  // Let ts-jest handle tsx files for testing
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  // Ignore these folders
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/example/',
    '<rootDir>/website/',
  ],
};
