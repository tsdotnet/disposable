import DisposableStateBase from './DisposableStateBase.js';

/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
class AsyncDisposableBase extends DisposableStateBase {
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

export { AsyncDisposableBase as default };
//# sourceMappingURL=AsyncDisposableBase.js.map
