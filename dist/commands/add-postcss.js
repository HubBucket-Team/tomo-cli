"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tasks = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("../utils");

const POSTCSS_DEPENDENCIES = ['cssnano', 'postcss-cli', 'postcss-reporter', 'postcss-safe-parser', 'postcss-import', 'postcss-cssnext', 'stylelint', 'uncss'];
/** @ignore */

const tasks = [{
  text: 'Create PostCSS config file',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* () {
      const cfg = new _utils.PostcssConfigEditor();
      yield cfg.create().commit();
    });

    return function task() {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.allDoNotExist)('postcss.config.js')
}, {
  text: 'Add PostCSS tasks to package.json',
  task: function () {
    var _ref2 = (0, _asyncToGenerator2.default)(function* () {
      const pkg = new _utils.PackageJsonEditor();
      yield pkg.extend({}).commit();
    });

    return function task() {
      return _ref2.apply(this, arguments);
    };
  }(),
  condition: () => (0, _utils.someDoExist)('package.json')
}, {
  text: 'Install PostCSS dependencies',
  task: ({
    skipInstall
  }) => (0, _utils.install)([POSTCSS_DEPENDENCIES], {
    dev: true,
    skipInstall
  }),
  condition: () => (0, _utils.someDoExist)('package.json')
}];
exports.tasks = tasks;
var _default = tasks;
exports.default = _default;