"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ObjectDisposedException_1 = tslib_1.__importDefault(require("./ObjectDisposedException"));
class DisposableBase {
    constructor(disposableObjectName, finalizer) {
        this._disposableObjectName = disposableObjectName;
        this.__disposableState = {
            disposed: false,
            ...(finalizer && { finalizer })
        };
    }
    get wasDisposed() {
        return this.__disposableState.disposed;
    }
    dispose() {
        const state = this.__disposableState;
        if (!state.disposed) {
            state.disposed = true;
            const finalizer = state.finalizer;
            delete state.finalizer;
            Object.freeze(state);
            try {
                this._onDispose();
            }
            finally {
                if (finalizer)
                    finalizer();
            }
        }
    }
    throwIfDisposed(message, objectName = this._disposableObjectName) {
        if (this.__disposableState.disposed)
            throw new ObjectDisposedException_1.default(objectName);
        return true;
    }
    _onDispose() { }
}
exports.default = DisposableBase;
//# sourceMappingURL=DisposableBase.js.map