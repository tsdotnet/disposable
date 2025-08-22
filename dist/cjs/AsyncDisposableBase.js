"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const DisposableStateBase_1 = tslib_1.__importDefault(require("./DisposableStateBase"));
class AsyncDisposableBase extends DisposableStateBase_1.default {
    constructor(finalizer) {
        super(finalizer);
    }
    async disposeAsync() {
        if (!this._startDispose())
            return;
        try {
            await this._onDisposeAsync();
        }
        finally {
            this._finishDispose();
        }
    }
    _onDisposeAsync() { return Promise.resolve(); }
}
exports.default = AsyncDisposableBase;
//# sourceMappingURL=AsyncDisposableBase.js.map