/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
export function dispose(...disposables) {
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
export function using(disposable, closure) {
    try {
        return closure(disposable);
    }
    finally {
        singleUnsafe(disposable, false);
    }
}
function singleUnsafe(disposable, trapException) {
    if (disposable && typeof disposable === 'object') {
        if (typeof disposable.dispose !== 'function')
            return;
        if (trapException) {
            try {
                disposable.dispose();
            }
            catch (ex) {
                console.error(ex);
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
export default dispose;
//# sourceMappingURL=dispose.js.map