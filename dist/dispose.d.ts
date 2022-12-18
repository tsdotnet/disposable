/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import Disposable from './Disposable';
export type DisposableItem = Disposable | null | undefined;
export type DisposableItemArray = DisposableItem[] | null | undefined;
/**
 * Takes any number of disposables as arguments and attempts to dispose them.
 * Any exceptions thrown within a dispose are not trapped.
 * Use 'dispose.withoutException' to automatically trap exceptions.
 * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
 */
export declare function dispose(...disposables: DisposableItem[]): void;
export declare namespace dispose {
    /**
     * Use this when only disposing one object to avoid creation of arrays.
     * @param disposable
     * @param trapException
     */
    function single(disposable: DisposableItem, trapException?: boolean): void;
    /**
     * Takes any number of disposables as arguments and attempts to dispose them after a zero timeout.
     * All exceptions are logged but not thrown.
     * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
     */
    function deferred(...disposables: DisposableItem[]): void;
    /**
     * Takes any number of disposables and traps any errors that occur when disposing.
     * Returns an array of the exceptions thrown.
     * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
     */
    function withoutException(...disposables: DisposableItem[]): void;
    /**
     * Takes an array of disposable objects and ensures they are disposed.
     * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
     * @param trapExceptions If true, prevents exceptions from being thrown when disposing.
     */
    function these(disposables: DisposableItemArray, trapExceptions?: boolean): void;
    namespace these {
        /**
         * Takes any number of disposables as arguments and attempts to dispose them after a zero timeout.
         * Exceptions are logged but not thrown.
         * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
         * @param delay Milliseconds to wait before disposing.  Default is zero (0).  A higher number could have detrimental consequences or could improve foreground performance.
         */
        function deferred(disposables: DisposableItemArray, delay?: number): void;
        namespace deferred {
            /**
             * Takes any number of disposables as arguments and attempts to dispose them after a zero timeout.
             * Exceptions are logged but not thrown.
             * WARNING: Use this unsafe method when guaranteed not to cause events that will make modifications to the disposables array.
             * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
             * @param delay Milliseconds to wait before disposing.  Default is zero (0).  A higher number could have detrimental consequences or could improve foreground performance.
             */
            function unsafe(disposables: DisposableItemArray, delay?: number): void;
        }
        /**
         * Takes an array of disposable objects and ensures they are disposed.
         * WARNING: Use this unsafe method when guaranteed not to cause events that will make modifications to the disposables array.
         * @param disposables The objects to dispose of. Can accept <any> and will ignore objects that don't have a dispose() method.
         * @param trapExceptions If true, prevents exceptions from being thrown when disposing.
         */
        function unsafe(disposables: DisposableItemArray, trapExceptions?: boolean): void;
    }
}
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
export declare function using<TDisposable extends Disposable, TReturn>(disposable: TDisposable, closure: (disposable: TDisposable) => TReturn): TReturn;
export default dispose;
