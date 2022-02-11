"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisposableBase = exports.dispose = exports.ObjectDisposedException = void 0;
const tslib_1 = require("tslib");
const DisposableBase_1 = (0, tslib_1.__importDefault)(require("./DisposableBase"));
exports.DisposableBase = DisposableBase_1.default;
const dispose_1 = (0, tslib_1.__importDefault)(require("./dispose"));
exports.dispose = dispose_1.default;
const ObjectDisposedException_1 = (0, tslib_1.__importDefault)(require("./ObjectDisposedException"));
exports.ObjectDisposedException = ObjectDisposedException_1.default;
exports.default = DisposableBase_1.default;
//# sourceMappingURL=index.js.map