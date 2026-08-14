module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: '<rootDir>/../tsconfig.spec.json',
    }],
  },
  moduleNameMapper: {
    '^@safqa/types$': '<rootDir>/../../../packages/types/dist/index.js',
    '^@safqa/utils$': '<rootDir>/../../../packages/utils/dist/index.js',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
