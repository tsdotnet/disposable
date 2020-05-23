/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ObjectDisposedException from './ObjectDisposedException';
export default class DisposableBase {
    constructor(disposableObjectName, finalizer) {
        this._disposableObjectName = disposableObjectName;
        this.__state = {
            disposed: false,
            finalizer: finalizer || undefined
        };
    }
    get wasDisposed() {
        return this.__state.disposed;
    }
    // NOTE: Do not override this method.  Override _onDispose instead.
    dispose() {
        const state = this.__state;
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
        if (this.__state.disposed)
            throw new ObjectDisposedException(objectName);
        return true;
    }
    // Placeholder for overrides.
    /**
     * Is called when this object is disposed.  Should NOT be called directly.
     * Override this method to handle disposal.
     */
    _onDispose() { }
}
//# sourceMappingURL=DisposableBase.js.map