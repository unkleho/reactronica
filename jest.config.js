module.exports = {
  // preset: 'ts-jest',
  // testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      // tsConfig: 'tsconfig.json',
      diagnostics: false,
    },
  },
  // moduleNameMapper: {
  //   '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
  // },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
