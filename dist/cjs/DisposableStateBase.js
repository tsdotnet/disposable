"use strict";
/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ObjectDisposedException_1 = tslib_1.__importDefault(require("./ObjectDisposedException"));
const ALIVE = 0;
const DISPOSE_CALLED = 1;
const DISPOSING = 2;
const DISPOSED = 3;
class DisposableStateBase {
    constructor(finalizer) {
        this.__disposeState = {
            state: 0,
            ...(finalizer && { finalizer })
        };
    }
    get wasDisposed() {
        const state = this.__disposeState.state;
        return state != ALIVE && state != DISPOSE_CALLED;
    }
    assertIsAlive(strict = false) {
        const state = this.__disposeState.state;
        if (strict ? state !== ALIVE : this.wasDisposed) {
            throw new ObjectDisposedException_1.default(this.constructor.name);
        }
        return true;
    }
    _onBeforeDispose() { }
    _startDispose() {
        if (this.__disposeState.state !== ALIVE) {
            return false;
        }
        this.__disposeState.state = DISPOSE_CALLED;
        try {
            this._onBeforeDispose();
        }
        finally {
            if (this.__disposeState.state === DISPOSE_CALLED) {
                this.__disposeState.state = DISPOSING;
            }
        }
        return true;
    }
    _finishDispose() {
        const state = this.__disposeState;
        const finalizer = state.finalizer;
        delete state.finalizer;
        this.__disposeState.state = DISPOSED;
        Object.freeze(state);
        if (finalizer)
            finalizer();
    }
}
exports.default = DisposableStateBase;
//# sourceMappingURL=DisposableStateBase.js.map