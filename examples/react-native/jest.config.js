const {resolve} = require('path');

module.exports = {
  preset: 'react-native',
  transform: {
    '\\.(js|ts|tsx)$': require.resolve('react-native/elric/preprocessor.js'),
  },
  // this is specific to the elric repo, not generally needed (the files we ignore will be in node_modules which is ignored by default)
  transformIgnorePatterns: [resolve(__dirname, '../../packages')],
};
