/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 */
/* eslint-disable @typescript-eslint/no-use-before-define,@typescript-eslint/no-namespace,no-inner-declarations */
/**
 * Takes any number of disposables as arguments and attempts to dispose them.
 * Any exceptions thrown within a dispose are not trapped.
 * Use 'dispose.withoutException' to automatically trap exceptions.
 * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
 */
export function dispose(...disposables) {
    // The disposables arguments array is effectively localized so it's safe.
    theseUnsafe(disposables, false);
}
(function (dispose) {
    /**
     * Use this when only disposing one object to avoid creation of arrays.
     * @param disposable
     * @param trapException
     */
    function single(disposable, trapException = false) {
        if (disposable)
            singleUnsafe(disposable, trapException);
    }
    dispose.single = single;
    /**
     * Takes any number of disposables as arguments and attempts to dispose them after a zero timeout.
     * All exceptions are logged but not thrown.
     * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
     */
    function deferred(...disposables) {
        // The disposables arguments array is effectively localized so it's safe.
        these.deferred.unsafe(disposables);
    }
    dispose.deferred = deferred;
    /**
     * Takes any number of disposables and traps any errors that occur when disposing.
     * Returns an array of the exceptions thrown.
     * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
     */
    function withoutException(...disposables) {
        // The disposables arguments array is effectively localized so it's safe.
        theseUnsafe(disposables, true);
    }
    dispose.withoutException = withoutException;
    /**
     * Takes an array of disposable objects and ensures they are disposed.
     * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
     * @param trapExceptions If true, prevents exceptions from being thrown when disposing.
     */
    function these(disposables, trapExceptions) {
        if (!disposables || !disposables.length)
            return;
        theseUnsafe(disposables.slice(), trapExceptions);
    }
    dispose.these = these;
    (function (these) {
        /**
         * Takes any number of disposables as arguments and attempts to dispose them after a zero timeout.
         * Exceptions are logged but not thrown.
         * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
         * @param delay Milliseconds to wait before disposing.  Default is zero (0).  A higher number could have detrimental consequences or could improve foreground performance.
         */
        // tslint:disable-next-line:no-shadowed-variable
        function deferred(disposables, delay = 0) {
            deferredUnsafe(disposables && disposables.length ? disposables.slice() : null, delay);
        }
        these.deferred = deferred;
        (function (deferred) {
            /**
             * Takes any number of disposables as arguments and attempts to dispose them after a zero timeout.
             * Exceptions are logged but not thrown.
             * WARNING: Use this unsafe method when guaranteed not to cause events that will make modifications to the disposables array.
             * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
             * @param delay Milliseconds to wait before disposing.  Default is zero (0).  A higher number could have detrimental consequences or could improve foreground performance.
             */
            function unsafe(disposables, delay = 0) {
                deferredUnsafe(disposables, delay);
            }
            deferred.unsafe = unsafe;
        })(deferred = these.deferred || (these.deferred = {}));
        /**
         * Takes an array of disposable objects and ensures they are disposed.
         * WARNING: Use this unsafe method when guaranteed not to cause events that will make modifications to the disposables array.
         * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
         * @param trapExceptions If true, prevents exceptions from being thrown when disposing.
         */
        function unsafe(disposables, trapExceptions) {
            theseUnsafe(disposables, trapExceptions);
        }
        these.unsafe = unsafe;
    })(these = dispose.these || (dispose.these = {}));
})(dispose || (dispose = {}));
/**
 * Just like in C# this 'using' function will ensure the passed disposable is disposed when the closure has finished.
 *
 * Usage:
 * ```typescript
 * using(new DisposableObject(),(myObj)=>{
 *   // do work with myObj
 * });
 * // myObj automatically has it's dispose method called.
 * ```
 *
 * @param disposable Object to be disposed.
 * @param closure Function call to execute.
 * @returns {TReturn} Returns whatever the closure's return value is.
 */
export function using(disposable, closure) {
    try {
        return closure(disposable);
    }
    finally {
        singleUnsafe(disposable, false);
    }
}
/**
 * This private function makes disposing more robust for when there's no type checking.
 * If trapException is 'true' it logs any exception instead of throwing.
 */
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
/*
 * The following  dispose methods assume they're working on a local arrayCopy and it's unsafe for external use.
 */
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