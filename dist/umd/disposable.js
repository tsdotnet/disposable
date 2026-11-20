(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.tsdotnet = global.tsdotnet || {}, global.tsdotnet.disposable = global.tsdotnet.disposable || {})));
})(this, (function (exports) { 'use strict';

    /*!
     * @author electricessence / https://github.com/electricessence/
     * @license MIT
     */
    class ObjectDisposedException extends Error {
        objectName;
        constructor(objectName, message) {
            super(message ?? `Object '${objectName}' has been disposed and cannot be used.`);
            this.objectName = objectName;
            this.name = 'ObjectDisposedException';
        }
        static throwIfDisposed(disposable, objectName, message) {
            if (disposable.wasDisposed)
                throw new ObjectDisposedException(objectName, message);
            return true;
        }
    }

    /*!
     * @author electricessence / https://github.com/electricessence/
     * @license MIT
     */
    const ALIVE = 0;
    const DISPOSE_CALLED = 1;
    const DISPOSING = 2;
    const DISPOSED = 3;
    class DisposableStateBase {
        __disposeState;
        constructor(finalizer) {
            this.__disposeState = {
                state: 0,
                ...(finalizer && { finalizer })
            };
        }
        get disposeState() {
            return this.__disposeState.state;
        }
        get wasDisposed() {
            const state = this.__disposeState.state;
            return state != ALIVE && state != DISPOSE_CALLED;
        }
        assertIsAlive(strict = false) {
            const state = this.__disposeState.state;
            if (strict ? state !== ALIVE : this.wasDisposed) {
                throw new ObjectDisposedException(this.constructor.name);
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

    /*!
     * @author electricessence / https://github.com/electricessence/
     * @license MIT
     */
    function dispose(...disposables) {
        theseUnsafe(disposables, false);
    }
    (function (dispose) {
        function single(disposable, trapException = false) {
            if (disposable)
                singleUnsafe(disposable, trapException);
        }
        dispose.single = single;
        function deferred(...disposables) {
            these.deferred.unsafe(disposables);
        }
        dispose.deferred = deferred;
        function withoutException(...disposables) {
            theseUnsafe(disposables, true);
        }
        dispose.withoutException = withoutException;
        function these(disposables, trapExceptions) {
            if (!disposables || !disposables.length)
                return;
            theseUnsafe(disposables.slice(), trapExceptions);
        }
        dispose.these = these;
        (function (these) {
            function deferred(disposables, delay = 0) {
                deferredUnsafe(disposables && disposables.length ? disposables.slice() : null, delay);
            }
            these.deferred = deferred;
            (function (deferred) {
                function unsafe(disposables, delay = 0) {
                    deferredUnsafe(disposables, delay);
                }
                deferred.unsafe = unsafe;
            })(deferred = these.deferred || (these.deferred = {}));
            function unsafe(disposables, trapExceptions) {
                theseUnsafe(disposables, trapExceptions);
            }
            these.unsafe = unsafe;
        })(these = dispose.these || (dispose.these = {}));
    })(dispose || (dispose = {}));
    function singleUnsafe(disposable, trapException) {
        if (disposable && typeof disposable === 'object') {
            if (typeof disposable.dispose !== 'function')
                return;
            if (trapException) {
                try {
                    disposable.dispose();
                }
                catch (ex) {
                    if (typeof console !== 'undefined' && typeof console.error === 'function') {
                        console.error('Error during disposal:', ex);
                    }
                }
            }
            else
                disposable.dispose();
        }
    }
    function theseUnsafe(disposables, trapExceptions) {
        if (!disposables)
            return;
        for (const d of disposables)
            singleUnsafe(d, trapExceptions);
    }
    function deferredUnsafe(disposables, delay = 0) {
        if (!disposables || !disposables.length)
            return;
        setTimeout(theseUnsafe, delay && delay > 0 ? delay : 0, disposables, true);
    }
    var dispose_default = dispose;

    exports.AsyncDisposableBase = AsyncDisposableBase;
    exports.DisposableBase = DisposableBase;
    exports.ObjectDisposedException = ObjectDisposedException;
    exports.dispose = dispose_default;

}));
//# sourceMappingURL=disposable.js.map
