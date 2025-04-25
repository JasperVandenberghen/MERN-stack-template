'use strict';

module.exports = {
  collectCoverage: false,
  coverageReporters: ['text'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};