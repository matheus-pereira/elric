module.exports = {
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/setupelric.js'],
  testEnvironment: 'jsdom',
  transform: {
    '\\.[tj]s$': ['babel-elric', {configFile: require.resolve('./.babelrc')}],
  },
};
