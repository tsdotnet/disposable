"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ObjectDisposedException_1 = tslib_1.__importDefault(require("./ObjectDisposedException"));
class DisposableBase {
    constructor(disposableObjectName, finalizer) {
        this._disposableObjectName = disposableObjectName;
        this.__disposableState = {
            disposed: false,
            finalizer: finalizer || undefined
        };
    }
    get wasDisposed() {
        return this.__disposableState.disposed;
    }
    // NOTE: Do not override this method.  Override _onDispose instead.
    dispose() {
        const state = this.__disposableState;
        if (!state.disposed) {
            // Preemptively set wasDisposed in order to prevent repeated disposing.
            // NOTE: in true multi-threaded scenarios, this would need to be synchronized.
            state.disposed = true;
            const finalizer = state.finalizer;
            state.finalizer = undefined;
            delete state.finalizer;
            Object.freeze(state);
            try {
                this._onDispose(); // Protected override.
            }
            finally {
                if (finalizer)
                    finalizer();
            }
        }
    }
    /**
     * Utility for throwing exception when this object is accessed.
     * @param message
     * @param objectName Optional object name override.
     */
    throwIfDisposed(message, objectName = this._disposableObjectName) {
        if (this.__disposableState.disposed)
            throw new ObjectDisposedException_1.default(objectName);
        return true;
    }
    // Placeholder for overrides.
    /**
     * Is called when this object is disposed.  Should NOT be called directly.
     * Override this method to handle disposal.
     */
    _onDispose() { }
}
exports.default = DisposableBase;
//# sourceMappingURL=DisposableBase.js.map