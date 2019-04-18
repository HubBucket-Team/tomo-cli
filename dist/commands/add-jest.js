"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

const pkg = new _utils.PackageJsonEditor();
const JEST_DEPENDENCIES = ['jest', 'babel-jest'];
var _default = [{
  text: 'Add test tasks to package.json',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* () {
      yield pkg.extend({
        script: {
          test: 'jest .*.test.js --coverage',
          'test:watch': 'npm test -- --watchAll'
        }
      }).commit();
    });

    return function task() {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install Jest dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)(JEST_DEPENDENCIES, {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.default = _default;