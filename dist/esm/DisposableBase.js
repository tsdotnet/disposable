/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import ObjectDisposedException from './ObjectDisposedException';
export default class DisposableBase {
    _disposableObjectName;
    __disposableState;
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
            throw new ObjectDisposedException(objectName);
        return true;
    }
    _onDispose() { }
}
//# sourceMappingURL=DisposableBase.js.map