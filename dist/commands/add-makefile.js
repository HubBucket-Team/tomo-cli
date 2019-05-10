"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.addMakefile = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _common = require("../utils/common");

var _MakefileEditor = _interopRequireDefault(require("../utils/MakefileEditor"));

/**
 * @type {task[]}
 * @see https://www.gnu.org/software/make/manual/html_node/Simple-Makefile.html#Simple-Makefile
 */
const addMakefile = [{
  text: 'Create Makefile',
  task: function () {
    var _ref = (0, _asyncToGenerator2.default)(function* () {
      yield new _MakefileEditor.default().create().write('# Makefile built with tomo').commit();
    });

    return function task() {
      return _ref.apply(this, arguments);
    };
  }(),
  condition: () => (0, _common.allDoNotExist)('Makefile')
}, {
  text: 'Import tasks from package.json scripts',
  task: function () {
    var _ref2 = (0, _asyncToGenerator2.default)(function* () {
      yield new _MakefileEditor.default().delete().create().importScripts().appendScripts().appendHelpTask().commit();
    });

    return function task() {
      return _ref2.apply(this, arguments);
    };
  }(),
  condition: () => (0, _common.allDoExist)('Makefile', 'package.json'),
  optional: () => (0, _common.allDoExistSync)('Makefile', 'package.json')
}];
exports.addMakefile = addMakefile;
var _default = addMakefile;
exports.default = _default;