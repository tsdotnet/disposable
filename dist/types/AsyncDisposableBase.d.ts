/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import AsyncDisposable from './AsyncDisposable.js';
import DisposableStateBase from './DisposableStateBase.js';
export default abstract class AsyncDisposableBase extends DisposableStateBase implements AsyncDisposable {
    protected constructor(finalizer?: () => void | null);
    disposeAsync(): Promise<void>;
    protected _onDisposeAsync(): Promise<void>;
}
