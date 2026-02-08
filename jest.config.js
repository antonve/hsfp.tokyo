const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', 'jest-extended/all'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^next-intl$': '<rootDir>/src/test-utils/next-intl.tsx',
    '^next-intl/link$': '<rootDir>/src/test-utils/next-intl-link.tsx',
    '^next-intl/server$': '<rootDir>/src/test-utils/next-intl-server.ts',
    '^next-intl/middleware$': '<rootDir>/src/test-utils/next-intl-middleware.ts',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
