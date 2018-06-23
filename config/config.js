const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'jsweb'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/jsweb'
  },

  test: {
    root: rootPath,
    app: {
      name: 'jsweb'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/jsweb-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'jsweb'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/jsweb-production'
  }
};

module.exports = config[env];
