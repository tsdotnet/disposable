/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import type Disposable from './Disposable';
export type DisposableItem = Disposable | null | undefined;
export type DisposableItemArray = DisposableItem[] | null | undefined;
export declare function dispose(...disposables: DisposableItem[]): void;
export declare namespace dispose {
    function single(disposable: DisposableItem, trapException?: boolean): void;
    function deferred(...disposables: DisposableItem[]): void;
    function withoutException(...disposables: DisposableItem[]): void;
    function these(disposables: DisposableItemArray, trapExceptions?: boolean): void;
    namespace these {
        function deferred(disposables: DisposableItemArray, delay?: number): void;
        namespace deferred {
            function unsafe(disposables: DisposableItemArray, delay?: number): void;
        }
        function unsafe(disposables: DisposableItemArray, trapExceptions?: boolean): void;
    }
}
export declare function using<TDisposable extends Disposable, TReturn>(disposable: TDisposable, closure: (disposable: TDisposable) => TReturn): TReturn;
export default dispose;
