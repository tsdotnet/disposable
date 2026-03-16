"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const DisposableStateBase_js_1 = tslib_1.__importDefault(require("./DisposableStateBase.js"));
class DisposableBase extends DisposableStateBase_js_1.default {
    constructor(finalizer) {
        super(finalizer);
    }
    dispose() {
        if (!this._startDispose())
            return;
        try {
            this._onDispose();
        }
        finally {
            this._finishDispose();
        }
    }
    _onDispose() { }
}
exports.default = DisposableBase;
//# sourceMappingURL=DisposableBase.js.map