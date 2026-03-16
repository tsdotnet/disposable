/*!
 * @author electricessence / https://github.com/electricessence/
 * @license MIT
 */
import Disposable from './Disposable.js';
import DisposableStateBase from './DisposableStateBase.js';
export default abstract class DisposableBase extends DisposableStateBase implements Disposable {
    protected constructor(finalizer?: () => void | null);
    dispose(): void;
    protected _onDispose(): void;
}
