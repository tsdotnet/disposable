/* tslint:disable:variable-name */
/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
import ObjectDisposedException from './ObjectDisposedException';
class DisposableBase {
    // eslint-disable-next-line no-useless-constructor
    constructor(_disposableObjectName, __finalizer) {
        this._disposableObjectName = _disposableObjectName;
        this.__finalizer = __finalizer;
        this.__wasDisposed = false;
    }
    get wasDisposed() {
        return this.__wasDisposed;
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
    // NOTE: Do not override this method.  Override _onDispose instead.
    dispose() {
        const _ = this;
        if (!_.__wasDisposed) {
            // Preemptively set wasDisposed in order to prevent repeated disposing.
            // NOTE: in true multi-threaded scenarios, this would need to be synchronized.
            _.__wasDisposed = true;
            try {
                _._onDispose(); // Protected override.
            }
            finally {
                if (_.__finalizer) {
                    // Private finalizer...
                    _.__finalizer();
                    _.__finalizer = undefined;
                }
            }
        }
    }
    // Placeholder for overrides.
    // tslint:disable-next-line:no-empty
    /**
     * Is called when this object is disposed.  Should not be called directly.
     * Override this method to handle disposal.
     * @private
     */
    _onDispose() { }
}
export default DisposableBase;
//# sourceMappingURL=DisposableBase.js.map