/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ObjectDisposedException from './ObjectDisposedException';
export default class DisposableBase {
    constructor(_disposableObjectName, __finalizer) {
        this._disposableObjectName = _disposableObjectName;
        this.__finalizer = __finalizer;
        this.__wasDisposed = false;
    }
    get wasDisposed() {
        return this.__wasDisposed;
    }
    // NOTE: Do not override this method.  Override _onDispose instead.
    dispose() {
        if (!this.__wasDisposed) {
            // Preemptively set wasDisposed in order to prevent repeated disposing.
            // NOTE: in true multi-threaded scenarios, this would need to be synchronized.
            this.__wasDisposed = true;
            try {
                this._onDispose(); // Protected override.
            }
            finally {
                if (this.__finalizer) {
                    // Private finalizer...
                    this.__finalizer();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.__finalizer = undefined;
                }
            }
        }
    }
    /**
     * Utility for throwing exception when this object is accessed.
     * @param message
     * @param objectName Optional object name override.
     */
    throwIfDisposed(message, objectName = this._disposableObjectName) {
        if (this.__wasDisposed)
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