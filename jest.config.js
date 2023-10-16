module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@components/(.*)': '<rootDir>/src/components/$1',
    '@lib/(.*)': '<rootDir>/src/lib/$1',
  },
  setupFilesAfterEnv: ['jest-extended/all'],
}
