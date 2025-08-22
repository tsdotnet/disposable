import DisposableStateBase from './DisposableStateBase.js';

/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
class DisposableBase extends DisposableStateBase {
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

export { DisposableBase as default };
//# sourceMappingURL=DisposableBase.js.map
